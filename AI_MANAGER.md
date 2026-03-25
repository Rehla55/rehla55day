# AI Journey Manager

This system allows AI to automatically manage the 55-day Lenten journey website.

## System Architecture

```
Website (GitHub Pages)
    ↓ Firebase
Backend Worker (Your PC/Server)
    ↓ Firebase
AI Manager (Can be any AI)
```

## Backend Folder Structure (`J:\New folder\`)

| File | Purpose |
|------|---------|
| `firebase_worker.py` | Listens for submissions, validates answers, updates scores |
| `answers_key.py` | Contains correct answers for all 55 days per year |
| `sync_dates_to_firebase.py` | Syncs all journey dates to Firebase |
| `serviceAccountKey.json` | Firebase admin credentials |

## Management Methods

### 1. Firebase Database (Real-time)
AI can directly update Firebase to change dates and status.

**Firebase Path Structure:**
```
/journeyDates
  /current: { startDate, endDate, year, active }
  /2026: { startDate, endDate, easterDate }
  /2027: { startDate, endDate, easterDate }
  /2028: { startDate, endDate, easterDate }
  ...
  status: "active" | "ended" | "waiting"
```

### 2. Backend Scripts
Run from `J:\New folder\`:
```bash
python sync_dates_to_firebase.py  # Sync all dates to Firebase
python firebase_worker.py         # Start answer checker
```

### 3. REST API Server
Run `api_server.py` and AI can call these endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/status` | GET | Get current journey status |
| `/api/update-dates` | POST | Update all dates (2026-2050) |
| `/api/journey/<year>/dates` | GET | Get dates for specific year |
| `/api/close-journey` | POST | Close journey, prepare certificates |
| `/api/set-next-journey` | POST | Set next journey start |
| `/api/reset-journey` | POST | Reset for next year |

### 4. GitHub Actions
AI can trigger workflows via repository dispatch or manual trigger.

## Orthodox Easter Dates (Verified)

| Year | Great Lent Starts | Ends | Easter |
|------|-------------------|------|--------|
| 2026 | Feb 16 | Apr 11 | Apr 12 |
| 2027 | Feb 22 | Apr 18 | Apr 19 |
| 2028 | Feb 28 | Apr 16 | Apr 17 |
| 2029 | Feb 11 | Apr 7 | Apr 8 |
| 2030 | Mar 3 | Apr 28 | Apr 29 |
| ... | ... | ... | ... |
| 2050 | Feb 15 | Apr 11 | Apr 12 |

## How AI Manages the System

### Daily Operations:
1. `firebase_worker.py` runs 24/7 on your PC
2. It listens for submissions and automatically:
   - Validates timestamps
   - Checks anti-cheat (32s timer)
   - Awards 10 pts (correct) or 5 pts (wrong)
   - Updates leaderboard

### At the End of Each Journey:
1. AI calls `/api/close-journey` OR manually runs:
   ```bash
   python sync_dates_to_firebase.py
   ```
2. AI updates `/journeyDates/status` to "ended"
3. Site shows certificates to users

### Before New Journey Starts:
1. AI adds new answers to `answers_key.py`
2. AI runs `sync_dates_to_firebase.py`
3. Site automatically resets to normal operation on start date

## Setup

### 1. Backend Setup (J:\New folder\)
```bash
pip install firebase-admin
python sync_dates_to_firebase.py  # Initial setup
python firebase_worker.py         # Start the worker
```

### 2. GitHub Secrets
Add to GitHub repository secrets:
- `FIREBASE_SERVICE_ACCOUNT_KEY`: Your Firebase service account JSON

### 3. Install Dependencies
```bash
pip install firebase-admin flask requests
```

## Certificate System

Three tiers are automatically assigned:
1. **Top User**: Gold crown design with first place badge
2. **Participants**: Standard certificate with name and score
3. **Non-participants**: Simple thank you message

The system automatically:
- Detects if user is top scorer
- Checks if user has any points
- Assigns appropriate certificate type
- Allows download as PNG

## AI Command Examples

```python
# Example: AI updates Firebase directly
import firebase_admin
from firebase_admin import credentials, db

cred = credentials.Certificate('serviceAccountKey.json')
firebase_admin.initialize_app(cred, {'databaseURL': 'https://rehla55day-e8bf2-default-rtdb.firebaseio.com'})

# Update status to ended
db.reference('/journeyDates').update({'status': 'ended'})

# Update current journey
db.reference('/journeyDates/current').update({'active': False})

# Get top user
leaderboard = db.reference('/leaderboard').get()
users = sorted(leaderboard.items(), key=lambda x: x[1].get('score', 0), reverse=True)
print(f"Top user: {users[0]}")
```
