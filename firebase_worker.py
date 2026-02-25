import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import time
import os
import socket
from datetime import datetime, timezone, timedelta
from answers_key import CORRECT_ANSWERS

# --- CONFIGURATION ---
USE_EMULATOR = False
SERVICE_ACCOUNT_PATH = 'serviceAccountKey.json'
DATABASE_URL = 'https://rehla55day-e8bf2-default-rtdb.firebaseio.com'

# Identify this answer checker
CHECKER_ID = socket.gethostname()

# Initialize Firebase
try:
    cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
    firebase_admin.initialize_app(cred, {'databaseURL': DATABASE_URL})
    print(f"🚀 Answer Checker [{CHECKER_ID}] is ACTIVE. Listening for submissions...")
except Exception as e:
    print(f"❌ Initialization Error: {e}")
    exit()

def get_current_journey_day(custom_time=None):
    """Calculates the journey day based on Cairo time (UTC+2).
       Accepts an optional timestamp for historical validation."""
    start_date = datetime(2026, 2, 16, tzinfo=timezone.utc)
    cairo_offset = timedelta(hours=2)
    
    # Use the provided submission time or current time
    base_time = custom_time if custom_time else datetime.now(timezone.utc)
    now_cairo = base_time + cairo_offset
    
    # Normalize to midnight for day calculation
    now_cairo_midnight = now_cairo.replace(hour=0, minute=0, second=0, microsecond=0)
    
    diff = now_cairo_midnight - start_date
    day = diff.days + 1
    return day

def process_single_submission(uid, data):
    if not isinstance(data, dict): return
    
    submitted_day = data.get('day')
    choice = data.get('choice')
    timestamp_ms = data.get('timestamp') # The ServerValue.TIMESTAMP
    
    if submitted_day is None or choice is None:
        print(f"[{CHECKER_ID}] ❌ Invalid ticket format for user {uid}. Skipping.")
        db.reference(f'submissions/{uid}').delete()
        return

    # 100% Precision: Calculate what day it was when the user SUBMITTED
    try:
        timestamp_ms = data.get('timestamp')
        if not isinstance(timestamp_ms, (int, float)):
            raise ValueError("Timestamp is not a number")
            
        submission_dt = datetime.fromtimestamp(timestamp_ms / 1000.0, tz=timezone.utc)
        
        # We trust the timestamp because Security Rules force it to equal 'now'
        # This allows the PC to process tickets submitted while it was offline.
        actual_day_at_submission = get_current_journey_day(submission_dt)
    except Exception as e:
        print(f"[{CHECKER_ID}] ⚠️ Malformed timestamp for {uid}: {e}. Deleting ticket.")
        db.reference(f'submissions/{uid}').delete()
        return
    
    # Check 1: Is user trying to answer a past or future question?
    if submitted_day != actual_day_at_submission:
        print(f"[{CHECKER_ID}] 🛑 SECURITY ALERT: User {uid} tried to answer Day {submitted_day} at a time belonging to Day {actual_day_at_submission}.")
        db.reference(f'submissions/{uid}').delete()
        return

    print(f"[{CHECKER_ID}] 🔍 Checking submission for {uid} | Day {submitted_day}")

    # Variables to capture transaction state
    status_capture = {"reason": "unknown"}

    def update_score_transaction(current_user_data):
        """Atomic transaction to handle score logic and double-processing"""
        # Check 2: Does the account even exist?
        if current_user_data is None:
            status_capture["reason"] = "NO_ACCOUNT"
            return None # Abort transaction
        
        solved_days = current_user_data.get('solvedDays', "")
        
        # Check 3: Is it already solved? (Double-processing check)
        if f",{submitted_day}:" in solved_days:
            status_capture["reason"] = "ALREADY_PROCESSED"
            return None # Abort transaction

        # Check 4: Correctness logic
        is_correct = (choice == CORRECT_ANSWERS.get(submitted_day))
        points = 10 if is_correct else 5
        result_str = "correct" if is_correct else "wrong"
        
        # Apply updates
        current_user_data['score'] = current_user_data.get('score', 0) + points
        current_user_data['solvedDays'] = solved_days + f",{submitted_day}:{result_str},"
        current_user_data['lastAnsweredDay'] = submitted_day
        
        status_capture["reason"] = "SUCCESS"
        status_capture["points"] = points
        status_capture["result"] = result_str
        status_capture["final_score"] = current_user_data['score']
        status_capture["name"] = current_user_data.get('name', 'Anonymous')
        
        return current_user_data

    try:
        user_ref = db.reference(f'users/{uid}')
        # Run the transaction
        transaction_result = user_ref.transaction(update_score_transaction)
        
        reason = status_capture["reason"]
        
        if reason == "SUCCESS":
            # We processed it! Update leaderboard and delete ticket.
            db.reference(f'leaderboard/{uid}').update({
                'score': status_capture["final_score"],
                'name': status_capture["name"]
            })
            db.reference(f'submissions/{uid}').delete()
            print(f"✅ [{CHECKER_ID}] DONE: {uid} | {status_capture['result'].upper()} (+{status_capture['points']} pts)")
            
        elif reason == "ALREADY_PROCESSED":
            print(f"⏭️  [{CHECKER_ID}] IGNORED: {uid} was already processed by another device.")
            db.reference(f'submissions/{uid}').delete()
            
        elif reason == "NO_ACCOUNT":
            print(f"❌ [{CHECKER_ID}] REJECTED: User {uid} has no account profile. Skipping.")
            db.reference(f'submissions/{uid}').delete()
            
        else:
            print(f"⚠️ [{CHECKER_ID}] UNKNOWN: Transaction aborted for {uid} (Reason: {reason})")
            db.reference(f'submissions/{uid}').delete()

    except Exception as e:
        print(f"💥 [{CHECKER_ID}] CRITICAL ERROR for {uid}: {e}")

def listener_callback(event):
    try:
        if event.data is None: return
        path = event.path.strip('/')
        
        if path == "":
            # Handle initial batch or multiple submissions
            if isinstance(event.data, dict):
                for uid, data in event.data.items():
                    process_single_submission(uid, data)
        else:
            # Handle single new submission
            uid = path.split('/')[0]
            process_single_submission(uid, event.data)
    except Exception as e:
        print(f"💥 [{CHECKER_ID}] GLOBAL CHECKER ERROR: {e}")

# Start listening
db.reference('submissions').listen(listener_callback)

# Keep script running
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("\n👋 Answer Checker stopping...")
