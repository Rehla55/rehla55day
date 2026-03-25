# Database Schema - Year-by-Year Structure

## Firebase Structure

```
/journeyDates
  /current: { startDate, endDate, year, active }
  /2026: { startDate, endDate, easterDate }
  /2027: { startDate, endDate, easterDate }
  /2028: { startDate, endDate, easterDate }
  status: "active" | "ended" | "waiting"
  nextJourneyStart: "2027-02-22"

# Year-specific leaderboards (scores reset each year)
 /leaderboard
  /2026
    /{uid}
      name: "User Name"
      score: 450
  /2027
    /{uid}
      name: "User Name"
      score: 200

# Year-specific certificates
/certificates
  /2026
    generatedAt: timestamp
    topUser: { uid, name, score }
    totalParticipants: 150
  /2027
    generatedAt: timestamp
    topUser: { uid, name, score }
    totalParticipants: 200

# User profiles (scores stored per year)
/users
  /{uid}
    name: "User Name"
    email: "user@example.com"
    agreedToPolicy: true
    role: "user" | "admin" | "banned"
    # Year-specific scores
    score_2026: 450
    score_2027: 200
    solvedDays_2026: ",1:correct,5:wrong,..."
    solvedDays_2027: ",1:correct,..."
    currentJourney: "2026"
    lastActiveJourney: "2026"

# Submissions (temporary, processed by firebase_worker.py)
/submissions
  /{uid}
    day: 5
    choice: 1
    timestamp: 1234567890
```

## Key Differences from Old Structure

| Old (All-time) | New (Per Year) |
|----------------|----------------|
| `/leaderboard/{uid}` | `/leaderboard/{year}/{uid}` |
| `/users/{uid}/score` | `/users/{uid}/score_{year}` |
| `/users/{uid}/solvedDays` | `/users/{uid}/solvedDays_{year}` |

## Certificate Flow

1. Journey ends → `isJourneyEnded()` returns true
2. User logs in → gets their year-specific score (`score_{year}`)
3. Certificate page shows:
   - **Top User**: Gold certificate with crown
   - **Participants**: Standard certificate with name + score
   - **Non-participants**: Thank you message
4. Certificate includes: "رحلة 2026" (Journey 2026)
5. Download filename: `شهادة-التميز-2026.png`
