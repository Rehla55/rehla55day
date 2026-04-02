/**
 * =====================================================
 * INTEGRATION GUIDE - Holy Week Event
 * =====================================================
 * For: Rehla 55 (https://rehla55.github.io/)
 * =====================================================
 * 
 * FOLLOW THESE STEPS TO INTEGRATE:
 * =====================================================
 */

Step 1: ADD CSS LINK
--------------------
In index.html, add this line in the <head> section AFTER your existing styles:

    <link rel="stylesheet" href="holy-week-styles.css">

Step 2: ADD JAVASCRIPT FILE
---------------------------
In index.html, add this line before </body> (AFTER script.js):

    <script src="holy-week-app.js"></script>

Step 3: UPDATE FIREBASE DATA
----------------------------
Go to Firebase Console > Realtime Database

Create a new node: holy_week_questions

Add questions for days 1-7 (April 5-11):

{
  "1": {
    "q": "Enter your question in Arabic",
    "o": ["Option A", "Option B", "Option C", "Option D"],
    "a": 0,
    "e": "Explanation in Arabic"
  },
  "2": { ... },
  "3": { ... },
  "4": { ... },
  "5": { ... },
  "6": { ... },
  "7": { ... }
}

Step 4: MODIFY script.js (loadDailyContent)
-------------------------------------------
Find this line in script.js (~line 533):
    db.ref('questions/' + day).once('value')

Replace with:
    var questionsPath = window.getQuestionsPath ? window.getQuestionsPath() : 'questions';
    db.ref(questionsPath + '/' + day).once('value')


/**
 * =====================================================
 * TESTING
 * =====================================================
 * 
 * To test the Holy Week event, you can temporarily
 * change the date in holy-week-app.js:
 * 
 * CONFIG.eventStart = new Date('2026-04-05T00:00:00');
 * CONFIG.eventEnd = new Date('2026-04-13T00:00:00');
 * 
 * Set to a past date to test active state, or keep
 * future date to test countdown.
 */


/**
 * =====================================================
 * FEATURES SUMMARY
 * =====================================================
 * 
 * ✓ Auto-detects date and switches themes
 * ✓ Pre-event: Countdown timer with Days:Hours:Minutes:Seconds
 * ✓ During event (Apr 5-12): Purple/Gold theme + cross watermarks
 * ✓ Firebase path switches from "questions" to "holy_week_questions"
 * ✓ Leaderboard shows ☦ badges next to names
 * ✓ Toast notification when event starts
 * ✓ Completely reversible - reverts after April 12
 */
