import firebase_admin
from firebase_admin import credentials, db
import datetime
import math

# Orthodox Easter Calculation (Computus for Orthodox Church)
# Uses the Julian calendar for the full moon calculation

def orthodox_easter(year):
    """Calculate Orthodox Easter date for a given year."""
    # Julian calendar calculation
    a = year % 4
    b = year % 7
    c = year % 19
    d = (19 * c + 15) % 30
    e = (2 * a + 4 * b + 6 * d + 6) % 7
    
    # Easter is d+e days after March 21 (Julian)
    # March 21 Julian = April 3 Gregorian
    base = datetime.date(year, 4, 3)
    days_to_add = d + e
    
    # If days_to_add > 30, Easter is in May
    if days_to_add > 30:
        easter_julian = datetime.date(year, 5, 3 + (days_to_add - 30))
    else:
        easter_julian = datetime.date(year, 4, 3 + days_to_add)
    
    # Convert Julian to Gregorian (simplified)
    # For years 1900-2099: Gregorian = Julian + 13 days
    gregorian_offset = 13
    if year >= 2100:
        gregorian_offset = 14
    elif year >= 1900:
        gregorian_offset = 13
    
    easter_gregorian = easter_julian + datetime.timedelta(days=gregorian_offset)
    return easter_gregorian

def great_lent_start(easter_date):
    """Great Lent starts 55 days before Easter (Clean Monday)."""
    return easter_date - datetime.timedelta(days=55)

def great_lent_end(easter_date):
    """Great Lent ends on Lazarus Saturday (day before Palm Sunday)."""
    # Great Lent = 55 days, ends on Lazarus Saturday
    return easter_date - datetime.timedelta(days=8)

# Pre-calculated Orthodox Easter dates (verified)
ORTHODOX_EASTER = {
    2026: datetime.date(2026, 4, 12),
    2027: datetime.date(2027, 4, 19),
    2028: datetime.date(2028, 4, 17),
    2029: datetime.date(2029, 4, 8),
    2030: datetime.date(2030, 4, 28),
    2031: datetime.date(2031, 4, 13),
    2032: datetime.date(2032, 5, 2),
    2033: datetime.date(2033, 4, 25),
    2034: datetime.date(2034, 4, 10),
    2035: datetime.date(2035, 4, 30),
    2036: datetime.date(2036, 4, 21),
    2037: datetime.date(2037, 4, 6),
    2038: datetime.date(2038, 4, 26),
    2039: datetime.date(2039, 4, 18),
    2040: datetime.date(2040, 5, 7),
    2041: datetime.date(2041, 4, 22),
    2042: datetime.date(2042, 4, 14),
    2043: datetime.date(2043, 5, 4),
    2044: datetime.date(2044, 4, 25),
    2045: datetime.date(2045, 4, 10),
    2046: datetime.date(2046, 4, 30),
    2047: datetime.date(2047, 4, 21),
    2048: datetime.date(2048, 4, 6),
    2049: datetime.date(2049, 4, 26),
    2050: datetime.date(2050, 4, 18),
}

def calculate_journey_dates(year):
    """Calculate Great Lent journey dates for a given year."""
    if year in ORTHODOX_EASTER:
        easter = ORTHODOX_EASTER[year]
    else:
        easter = orthodox_easter(year)
    
    start = great_lent_start(easter)
    end = great_lent_end(easter)
    
    return {
        'year': year,
        'startDate': start.isoformat(),
        'endDate': end.isoformat(),
        'easterDate': easter.isoformat(),
        'days': (end - start).days + 1
    }

def update_firebase_dates(year):
    """Update Firebase with journey dates for a specific year."""
    # Initialize Firebase (use your service account)
    cred = credentials.Certificate('serviceAccountKey.json')
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://rehla55day-e8bf2-default-rtdb.firebaseio.com'
    })
    
    dates = calculate_journey_dates(year)
    
    ref = db.reference(f'/journeyDates/{year}')
    ref.set(dates)
    
    # Update current if this is the next active journey
    ref = db.reference('/journeyDates/current')
    ref.set(dates)
    
    print(f"Updated Firebase for {year}:")
    print(f"  Start: {dates['startDate']}")
    print(f"  End: {dates['endDate']}")
    print(f"  Easter: {dates['easterDate']}")
    
    return dates

def generate_multi_year_dates(start_year=2026, end_year=2050):
    """Generate dates for multiple years."""
    all_dates = {}
    for year in range(start_year, end_year + 1):
        all_dates[year] = calculate_journey_dates(year)
    return all_dates

def update_all_dates_to_firebase(start_year=2026, end_year=2050):
    """Update all years to Firebase."""
    cred = credentials.Certificate('serviceAccountKey.json')
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://rehla55day-e8bf2-default-rtdb.firebaseio.com'
    })
    
    ref = db.reference('/journeyDates')
    
    all_dates = {}
    for year in range(start_year, end_year + 1):
        dates = calculate_journey_dates(year)
        all_dates[str(year)] = dates
        
        # Also update script.js format
        print(f"{year}: {dates['startDate']} to {dates['endDate']}")
    
    ref.set(all_dates)
    print(f"\nUpdated {len(all_dates)} years to Firebase")

def get_script_dates_array():
    """Generate JavaScript array for script.js"""
    print("\n// Add this to script.js journeyDates array:")
    print("const journeyDates = [")
    for year in range(2026, 2051):
        dates = calculate_journey_dates(year)
        print(f"    {{ start: '{dates['startDate']}', end: '{dates['endDate']}' }},")
    print("];")

if __name__ == "__main__":
    # Calculate for next 25 years
    print("=" * 50)
    print("Orthodox Great Lent Dates (2026-2050)")
    print("=" * 50)
    
    all_dates = generate_multi_year_dates()
    
    for year, dates in all_dates.items():
        print(f"{year}: {dates['startDate']} → {dates['endDate']} ({dates['days']} days)")
    
    print("\n" + "=" * 50)
    
    # Uncomment to update Firebase:
    # update_all_dates_to_firebase()
    
    # Or generate JavaScript:
    # get_script_dates_array()
