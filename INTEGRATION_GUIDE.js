/**
 * =====================================================
 * INTEGRATION GUIDE - Holy Week Event for Rehla 55
 * =====================================================
 * 
 * STEP 1: Add to index.html (before </body>)
 * ----------------------------------------------
 * Add these lines right before the closing </body> tag:
 * 
 * <link rel="stylesheet" href="holy-week-styles.css">
 * <script src="holy-week-event.js"></script>
 * 
 * 
 * STEP 2: Add to Firebase (Firebase Console)
 * ----------------------------------------------
 * 1. Go to Firebase Console > Realtime Database
 * 2. Import the holy-week-data.json OR manually create:
 *    - Node: holy_week_questions
 *    - Add child nodes: 1, 2, 3, 4, 5, 6, 7
 *    - Each with: q (question), o (options array), a (answer index), e (explanation)
 * 
 * 
 * STEP 3: Modify script.js (loadDailyContent)
 * ----------------------------------------------
 * Find the loadDailyContent function and update:
 * 
 * Replace:
 *   db.ref('questions/' + day).once('value')
 * With:
 *   const path = window.getQuestionsPath ? window.getQuestionsPath() : 'questions';
 *   db.ref(path + '/' + day).once('value')
 * 
 * 
 * STEP 4: For Leaderboard crosses
 * ----------------------------------------------
 * The holy-week-event.js automatically patches renderLeaderboard.
 * Just ensure this line exists after loadLeaderboard():
 *   loadLeaderboard();
 * 
 * 
 * IMPORTANT NOTES:
 * ----------------------------------------------
 * 1. The event runs April 5-12, 2026 automatically
 * 2. Before April 5: Shows countdown banner
 * 3. During April 5-12: Purple theme + cross badges + special questions
 * 4. After April 12: Normal theme resumes
 * 
 * 
 * CUSTOMIZATION:
 * ----------------------------------------------
 * Edit holy-week-event.js to change dates:
 *   const EVENT_START = new Date("2026-04-05T00:00:00");
 *   const EVENT_END = new Date("2026-04-13T00:00:00");
 * 
 * Edit holy-week-styles.css for different colors.
 * Edit holy-week-data.json for your actual questions.
 */
