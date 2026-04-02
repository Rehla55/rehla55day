/**
 * =====================================================
 * HOLY WEEK EVENT MODULE - TEST VERSION
 * =====================================================
 * Set TEST_MODE = true and choose your test scenario
 */

(function() {
    // ========== TEST CONFIGURATION ==========
    const TEST_MODE = true;
    const TEST_SCENARIO = 'active'; // 'countdown', 'active', or 'inactive'
    // ========================================

    // Configuration
    const EVENT_START = new Date("2026-04-05T00:00:00");
    const EVENT_END = new Date("2026-04-13T00:00:00");
    const HOLY_WEEK_PATH = "holy_week_questions";
    const DAILY_PATH = "questions";

    // Test date override
    function getTestDate() {
        if (!TEST_MODE) return new Date();
        
        const now = new Date();
        switch(TEST_SCENARIO) {
            case 'countdown':
                return new Date("2026-04-01T12:00:00");
            case 'active':
                return new Date("2026-04-07T12:00:00");
            case 'inactive':
            default:
                return new Date("2026-03-01T12:00:00");
        }
    }

    // Check if Holy Week is active
    function isHolyWeekActive() {
        const now = TEST_MODE ? getTestDate() : new Date();
        return now >= EVENT_START && now < EVENT_END;
    }

    // Get the correct questions path
    window.getQuestionsPath = function() {
        return isHolyWeekActive() ? HOLY_WEEK_PATH : DAILY_PATH;
    };

    // Apply Holy Week theme
    function applyHolyWeekTheme(active) {
        const root = document.documentElement;
        if (active) {
            root.style.setProperty('--dark-blue', '#1a0a2e');
            root.style.setProperty('--gold', '#ffd700');
            document.body.style.background = 'radial-gradient(circle, #3d1a6e, #1a0a2e)';
            document.body.classList.add('holy-week-active');
        } else {
            root.style.setProperty('--dark-blue', '#001a33');
            root.style.setProperty('--gold', '#d4af37');
            document.body.style.background = 'radial-gradient(circle, #003366, #001a33)';
            document.body.classList.remove('holy-week-active');
        }
    }

    // Create countdown banner
    function createCountdownBanner() {
        const banner = document.createElement('div');
        banner.id = 'holyWeekCountdown';
        banner.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0;
            background: linear-gradient(135deg, #2d1b4e, #1a0a2e);
            color: #ffd700; padding: 15px; text-align: center;
            z-index: 9999; border-bottom: 3px solid #ffd700;
            font-family: 'Amiri', serif;
        `;
        banner.innerHTML = `
            <div style="font-size: 1.3rem; margin-bottom: 8px;">
                ✝️ <strong>أسبوع三郎 الالام</strong> ✝️
            </div>
            <div id="countdownTimer" style="font-size: 1.5rem; font-weight: bold;">
                جاري التحميل...
            </div>
            <div style="font-size: 0.9rem; color: #ccc; margin-top: 5px;">
                [وضع الاختبار] استعدادوا لتحدي روحاني خاص!
            </div>
        `;
        document.body.insertBefore(banner, document.body.firstChild);
        return banner;
    }

    // Create Holy Week active banner
    function createHolyWeekBanner() {
        const banner = document.createElement('div');
        banner.id = 'holyWeekBanner';
        banner.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0;
            background: linear-gradient(135deg, #2d1b4e, #1a0a2e);
            color: #ffd700; padding: 12px; text-align: center;
            z-index: 9999; border-bottom: 3px solid #ffd700;
            font-family: 'Amiri', serif;
        `;
        banner.innerHTML = `
            <div style="font-size: 1.2rem;">
                ✝️ <strong>أسبوع三郎 الالام - قيد التشغيل!</strong> ✝️
            </div>
            <div style="font-size: 0.85rem; color: #ffd700; margin-top: 3px;">
                [وضع الاختبار] 5 - 12 أبريل 2026
            </div>
        `;
        document.body.insertBefore(banner, document.body.firstChild);
        return banner;
    }

    // Add cross to leaderboard
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

    // Start countdown timer
    function startCountdown() {
        const banner = createCountdownBanner();
        const timerEl = document.getElementById('countdownTimer');
        
        function updateCountdown() {
            const now = TEST_MODE ? getTestDate() : new Date();
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
        setInterval(updateCountdown, 60000);
    }

    // Initialize Holy Week
    function initHolyWeek() {
        applyHolyWeekTheme(true);
        createHolyWeekBanner();
        
        // Show test toast
        if (window.showToast) {
            window.showToast('✝️ [اختبار] أسبوع三郎 الفصح بدأ!', 'success');
        }
    }

    // Debug info
    function showDebugInfo() {
        const debug = document.createElement('div');
        debug.id = 'holyWeekDebug';
        debug.style.cssText = `
            position: fixed; bottom: 10px; left: 10px;
            background: rgba(0,0,0,0.9); color: #fff;
            padding: 10px 15px; border-radius: 10px;
            font-size: 12px; z-index: 99999;
            border: 2px solid #ffd700;
            max-width: 280px;
        `;
        
        const isActive = isHolyWeekActive();
        const currentPath = window.getQuestionsPath();
        
        debug.innerHTML = `
            <strong style="color:#ffd700;">🔧 Holy Week Debug</strong><br>
            Mode: <span style="color:${TEST_MODE ? '#ff0' : '#0f0'}">${TEST_MODE ? 'TEST' : 'LIVE'}</span><br>
            Scenario: ${TEST_SCENARIO}<br>
            Simulated Date: ${getTestDate().toLocaleString()}<br>
            Event Active: <span style="color:${isActive ? '#0f0' : '#f00'}">${isActive ? '✓ YES' : '✗ NO'}</span><br>
            Questions Path: <strong>${currentPath}</strong><br>
            <button onclick="window.testScenario('active')" style="margin-top:8px;padding:4px 8px;background:#2d1b4e;color:#ffd700;border:1px solid #ffd700;border-radius:5px;cursor:pointer;font-size:11px;">Test Active</button>
            <button onclick="window.testScenario('countdown')" style="margin-top:8px;padding:4px 8px;background:#1a3333;color:#0ff;border:1px solid #0ff;border-radius:5px;cursor:pointer;font-size:11px;">Test Countdown</button>
            <button onclick="window.testScenario('inactive')" style="margin-top:8px;padding:4px 8px;background:#333;color:#fff;border:1px solid #888;border-radius:5px;cursor:pointer;font-size:11px;">Test Inactive</button>
        `;
        document.body.appendChild(debug);
    }

    // Global test function
    window.testScenario = function(scenario) {
        window.TEST_SCENARIO = scenario;
        location.reload();
    };

    // Initialize
    function init() {
        const now = TEST_MODE ? getTestDate() : new Date();
        
        if (isHolyWeekActive()) {
            initHolyWeek();
        } else if (now < EVENT_START) {
            startCountdown();
        }
        
        showDebugInfo();
        
        // Patch leaderboard
        const origRender = window.renderLeaderboard;
        window.renderLeaderboard = function() {
            if (origRender) origRender();
            if (isHolyWeekActive()) {
                setTimeout(window.addCrossToLeaderboard, 500);
            }
        };
    }

    // Run
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
