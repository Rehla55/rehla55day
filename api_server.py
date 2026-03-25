"""
AI Journey Manager API
This Flask API allows AI to manage the journey dates and status.
AI calls these endpoints to update dates, close journeys, and generate certificates.
"""

from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, db
from datetime import datetime, timedelta
import os

app = Flask(__name__)

# Orthodox Easter dates (verified)
ORTHODOX_EASTER = {
    2026: "2026-04-12", 2027: "2027-04-19", 2028: "2028-04-17",
    2029: "2029-04-08", 2030: "2030-04-28", 2031: "2031-04-13",
    2032: "2032-05-02", 2033: "2033-04-25", 2034: "2034-04-10",
    2035: "2035-04-30", 2036: "2036-04-21", 2037: "2037-04-06",
    2038: "2038-04-26", 2039: "2039-04-18", 2040: "2040-05-07",
    2041: "2041-04-22", 2042: "2042-04-14", 2043: "2043-05-04",
    2044: "2044-04-25", 2045: "2045-04-10", 2046: "2046-04-30",
    2047: "2047-04-21", 2048: "2048-04-06", 2049: "2049-04-26",
    2050: "2050-04-18"
}

def init_firebase():
    """Initialize Firebase connection."""
    if not firebase_admin.apps:
        cred = credentials.Certificate('serviceAccountKey.json')
        firebase_admin.initialize_app(cred, {
            'databaseURL': 'https://rehla55day-e8bf2-default-rtdb.firebaseio.com'
        })

def great_lent_dates(easter):
    """Calculate Great Lent start and end dates."""
    easter_dt = datetime.strptime(easter, "%Y-%m-%d")
    return {
        "startDate": (easter_dt - timedelta(days=55)).strftime("%Y-%m-%d"),
        "endDate": (easter_dt - timedelta(days=8)).strftime("%Y-%m-%d"),
        "easterDate": easter
    }

@app.route('/api/status', methods=['GET'])
def get_status():
    """Get current journey status."""
    init_firebase()
    ref = db.reference('/journeyDates/current')
    current = ref.get()
    return jsonify(current or {})

@app.route('/api/update-dates', methods=['POST'])
def update_all_dates():
    """Update all journey dates for 2026-2050."""
    init_firebase()
    
    dates = {}
    for year, easter in ORTHODOX_EASTER.items():
        dates[str(year)] = great_lent_dates(easter)
    
    ref = db.reference('/journeyDates')
    ref.set(dates)
    
    # Set current
    now = datetime.now()
    current_year = None
    for year_str, d in dates.items():
        start = datetime.strptime(d['startDate'], '%Y-%m-%d')
        end = datetime.strptime(d['endDate'], '%Y-%m-%d')
        if start <= now <= end:
            current_year = year_str
            break
    
    if current_year:
        ref = db.reference('/journeyDates/current')
        ref.set({**dates[current_year], 'year': int(current_year)})
    
    return jsonify({"success": True, "updated": len(dates), "current": current_year})

@app.route('/api/journey/<year>/dates', methods=['GET'])
def get_journey_dates(year):
    """Get dates for a specific year."""
    if int(year) in ORTHODOX_EASTER:
        easter = ORTHODOX_EASTER[int(year)]
        return jsonify(great_lent_dates(easter))
    return jsonify({"error": "Year not found"}), 404

@app.route('/api/close-journey', methods=['POST'])
def close_journey():
    """Close current journey and prepare certificates."""
    init_firebase()
    
    # Update status
    ref = db.reference('/journeyDates')
    ref.update({'status': 'ended'})
    
    # Get top user
    lb_ref = db.reference('/leaderboard')
    leaderboard = lb_ref.get()
    
    result = {"status": "closed", "certificates": {}}
    
    if leaderboard:
        users = [(uid, data.get('score', 0), data.get('name', 'Unknown')) 
                for uid, data in leaderboard.items() if isinstance(data, dict)]
        users.sort(key=lambda x: x[1], reverse=True)
        
        if users:
            result["certificates"]["topUser"] = {
                "uid": users[0][0],
                "name": users[0][2],
                "score": users[0][1]
            }
            result["certificates"]["totalParticipants"] = len(users)
    
    return jsonify(result)

@app.route('/api/set-next-journey', methods=['POST'])
def set_next_journey():
    """Set the next journey start date."""
    init_firebase()
    data = request.json
    next_start = data.get('nextStartDate')
    
    if next_start:
        ref = db.reference('/journeyDates')
        ref.update({'nextJourneyStart': next_start, 'status': 'waiting'})
        return jsonify({"success": True, "nextStart": next_start})
    
    return jsonify({"error": "nextStartDate required"}), 400

@app.route('/api/reset-journey', methods=['POST'])
def reset_journey():
    """Reset journey to active state for next year."""
    init_firebase()
    
    now = datetime.now()
    next_year = None
    
    for year, easter in ORTHODOX_EASTER.items():
        start = datetime.strptime(easter, "%Y-%m-%d") - timedelta(days=55)
        if start > now:
            next_year = year
            break
    
    if next_year:
        dates = great_lent_dates(ORTHODOX_EASTER[next_year])
        ref = db.reference('/journeyDates/current')
        ref.set({**dates, 'year': next_year, 'active': True})
        
        ref = db.reference('/journeyDates')
        ref.update({'status': 'active'})
        
        return jsonify({"success": True, "newJourney": next_year, "dates": dates})
    
    return jsonify({"error": "No future journey found"}), 404

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "timestamp": datetime.now().isoformat()})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
