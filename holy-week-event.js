/**
 * =====================================================
 * HOLY WEEK EVENT MODULE - Rehla 55
 * =====================================================
 * Auto-activates: April 5-12, 2026
 * Features: Theme swap, Firebase question switch, countdown, leaderboard badges
 * =====================================================
 */

(function() {
    // Configuration
    const EVENT_START = new Date("2026-04-05T00:00:00");
    const EVENT_END = new Date("2026-04-13T00:00:00"); // April 12 23:59:59
    const HOLY_WEEK_PATH = "holy_week_questions";
    const DAILY_PATH = "questions";

    // Check if Holy Week is active
    function isHolyWeekActive() {
        const now = new Date();
        return now >= EVENT_START && now < EVENT_END;
    }

    // Get the correct questions path based on event status
    window.getQuestionsPath = function() {
        return isHolyWeekActive() ? HOLY_WEEK_PATH : DAILY_PATH;
    };

    // Get questions for the current day (with event switching)
    window.getQuestions = function(day) {
        const path = getQuestionsPath();
        return db.ref(path + "/" + day).once('value');
    };

    // Apply Holy Week theme
    function applyHolyWeekTheme(active) {
        const root = document.documentElement;
        if (active) {
            root.style.setProperty('--dark-blue', '#1a0a2e');
            root.style.setProperty('--gold', '#ffd700');
            root.style.setProperty('--holy-purple', '#2d1b4e');
            document.body.style.background = 'radial-gradient(circle, #3d1a6e, #1a0a2e)';
        } else {
            root.style.setProperty('--dark-blue', '#001a33');
            root.style.setProperty('--gold', '#d4af37');
            root.style.removeProperty('--holy-purple');
            document.body.style.background = 'radial-gradient(circle, #003366, #001a33)';
        }
    }

    // Create countdown banner (pre-event)
    function createCountdownBanner() {
        const banner = document.createElement('div');
        banner.id = 'holyWeekCountdown';
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #2d1b4e, #1a0a2e);
            color: #ffd700;
            padding: 15px;
            text-align: center;
            z-index: 9999;
            border-bottom: 3px solid #ffd700;
            font-family: 'Amiri', serif;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        `;
        banner.innerHTML = `
            <div style="font-size: 1.3rem; margin-bottom: 8px;">
                ✝️ <strong>أسبوع三郎 الالام</strong> ✝️
            </div>
            <div id="countdownTimer" style="font-size: 1.5rem; font-weight: bold;">
                جاري التحميل...
            </div>
            <div style="font-size: 0.9rem; color: #ccc; margin-top: 5px;">
                استعدادوا لتحدي روحاني خاص!
            </div>
        `;
        document.body.insertBefore(banner, document.body.firstChild);
        return banner;
    }

    // Create Holy Week banner (during event)
    function createHolyWeekBanner() {
        const banner = document.createElement('div');
        banner.id = 'holyWeekBanner';
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #2d1b4e, #1a0a2e);
            color: #ffd700;
            padding: 12px;
            text-align: center;
            z-index: 9999;
            border-bottom: 3px solid #ffd700;
            font-family: 'Amiri', serif;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        `;
        banner.innerHTML = `
            <div style="font-size: 1.2rem;">
                ✝️ <strong>أسبوع三郎 الالام</strong> ✝️
            </div>
            <div style="font-size: 0.85rem; color: #ccc; margin-top: 3px;">
                5 - 12 أبريل 2026
            </div>
        `;
        document.body.insertBefore(banner, document.body.firstChild);
        return banner;
    }

    // Countdown timer logic
    function startCountdown() {
        const banner = createCountdownBanner();
        const timerEl = document.getElementById('countdownTimer');
        
        function updateCountdown() {
            const now = new Date();
            const diff = EVENT_START - now;
            
            if (diff <= 0) {
                banner.remove();
                initHolyWeek();
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            
            if (timerEl) {
                timerEl.textContent = `${days} يوم | ${hours} ساعة | ${minutes} دقيقة`;
            }
        }
        
        updateCountdown();
        setInterval(updateCountdown, 60000); // Update every minute
    }

    // Add cross badge to leaderboard names
    window.addCrossToLeaderboard = function() {
        if (!isHolyWeekActive()) return;
        
        const leaderboardList = document.getElementById('leaderboardList');
        if (!leaderboardList) return;
        
        const items = leaderboardList.querySelectorAll('.leaderboard-item');
        items.forEach(item => {
            const nameSpan = item.querySelector('span:nth-child(2)');
            if (nameSpan && !nameSpan.textContent.includes('☦')) {
                nameSpan.textContent = '☦️ ' + nameSpan.textContent;
            }
        });
    };

    // Holy Week initialization
    function initHolyWeek() {
        applyHolyWeekTheme(true);
        createHolyWeekBanner();
        showHolyWeekToast();
    }

    // Show Holy Week announcement toast
    function showHolyWeekToast() {
        if (window.showToast) {
            setTimeout(() => {
                window.showToast('✝️ أسبوع三郎 الفصح بدأ! تحدي روحاني خاص في انتظاركم', 'success');
            }, 2000);
        }
    }

    // Initialize based on current date
    function init() {
        const now = new Date();
        
        if (isHolyWeekActive()) {
            initHolyWeek();
        } else if (now < EVENT_START) {
            startCountdown();
        }
        
        // Patch loadDailyContent to use event-aware path
        patchDailyContent();
        
        // Patch leaderboard rendering
        patchLeaderboardRender();
    }

    // Patch loadDailyContent function
    function patchDailyContent() {
        const original = window.loadDailyContent;
        window.loadDailyContent = function(uid) {
            const day = window.getCurrentJourneyDay ? window.getCurrentJourneyDay() : 1;
            const path = window.getQuestionsPath ? window.getQuestionsPath() : 'questions';
            
            db.ref(path + '/' + day).once('value').then(qSnap => {
                // Continue with original logic but use event path
                if (window._hqSnapCallback) {
                    window._hqSnapCallback(qSnap, uid, day);
                }
            });
        };
    }

    // Patch leaderboard render to add crosses
    function patchLeaderboardRender() {
        const original = window.renderLeaderboard;
        window.renderLeaderboard = function() {
            if (original) original();
            if (isHolyWeekActive()) {
                setTimeout(window.addCrossToLeaderboard, 500);
            }
        };
    }

    // Override the questions loading in script.js
    window.loadHolyWeekQuestions = function(day) {
        return db.ref(HOLY_WEEK_PATH + '/' + day).once('value');
    };

    // Export for debugging
    window.HolyWeek = {
        isActive: isHolyWeekActive,
        applyTheme: applyHolyWeekTheme,
        getPath: window.getQuestionsPath
    };

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
