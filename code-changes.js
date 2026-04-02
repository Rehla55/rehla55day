/**
 * =====================================================
 * index.html CHANGES - Add before </body>
 * =====================================================
 */

    <!-- Holy Week Event Styles -->
    <link rel="stylesheet" href="holy-week-styles.css">
    
    <!-- Holy Week Event Script -->
    <script src="holy-week-event.js"></script>

/**
 * =====================================================
 * script.js CHANGES - In loadDailyContent function
 * =====================================================
 * Find line ~533: db.ref('questions/' + day).once('value')
 * Replace with:
 */

    // Holy Week Event: Use correct questions path
    const questionsPath = window.getQuestionsPath ? window.getQuestionsPath() : 'questions';
    db.ref(questionsPath + '/' + day).once('value').then(qSnap => {
        
/**
 * =====================================================
 * OPTIONAL: Add Holy Week message in homePage
 * =====================================================
 * Add inside the homePage card after sundaySpecialBox:
 */

    <div id="holyWeekSpecialArea"></div>

/**
 * =====================================================
 * Add this to script.js to show Holy Week message:
 * =====================================================
 */

    function showHolyWeekSpecial() {
        const isHolyWeek = window.HolyWeek && window.HolyWeek.isActive();
        if (!isHolyWeek) return;
        
        const area = document.getElementById('holyWeekSpecialArea');
        if (!area) return;
        
        area.innerHTML = `
            <div class="holy-week-notification">
                <span class="cross-icon">✝️</span>
                <strong>أسبوع三郎 الالام</strong>
                <span class="cross-icon">✝️</span>
                <p style="margin: 10px 0 0 0; font-size: 0.9rem;">
                    أسئلة روحانية خاصة هذا الأسبوع!
                </p>
            </div>
        `;
    }
    
    // Call after loadDailyContent
    setTimeout(showHolyWeekSpecial, 1000);
