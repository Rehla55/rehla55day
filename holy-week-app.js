/**
 * =====================================================
 * HOLY WEEK EVENT - Complete Application Logic
 * =====================================================
 * Rehla 55 - Holy Week & Resurrection Event
 * April 5-12, 2026
 * =====================================================
 */

(function() {
    'use strict';

    // ===========================================
    // CONFIGURATION
    // ===========================================
    const CONFIG = {
        eventStart: new Date('2026-04-05T00:00:00'),
        eventEnd: new Date('2026-04-13T00:00:00'),
        normalPath: 'questions',
        holyWeekPath: 'event_2026',
        enabled: true
    };

    // ===========================================
    // DATE UTILITIES
    // ===========================================
    function getCurrentDate() {
        return new Date();
    }

    function isHolyWeekActive() {
        if (!CONFIG.enabled) return false;
        const now = getCurrentDate();
        return now >= CONFIG.eventStart && now < CONFIG.eventEnd;
    }

    function isBeforeEvent() {
        if (!CONFIG.enabled) return false;
        return getCurrentDate() < CONFIG.eventStart;
    }

    function isResurrectionSunday() {
        if (!isHolyWeekActive()) return false;
        const now = getCurrentDate();
        const resurrectionDate = new Date('2026-04-12');
        return now.getFullYear() === resurrectionDate.getFullYear() &&
               now.getMonth() === resurrectionDate.getMonth() &&
               now.getDate() === resurrectionDate.getDate();
    }

    function getHolyWeekDay() {
        if (!isHolyWeekActive()) return null;
        const now = getCurrentDate();
        const start = CONFIG.eventStart;
        const diffTime = now - start;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays + 1;
    }

    function getTimeUntilEvent() {
        const diff = CONFIG.eventStart - getCurrentDate();
        if (diff <= 0) return null;
        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000),
            total: diff
        };
    }

    // ===========================================
    // PATH SWITCHER
    // ===========================================
    window.getQuestionsPath = function() {
        return isHolyWeekActive() ? CONFIG.holyWeekPath : CONFIG.normalPath;
    };

    window.getHolyWeekDayNumber = function() {
        return getHolyWeekDay();
    };

    window.isResurrectionSunday = function() {
        return isResurrectionSunday();
    };

    // ===========================================
    // THEME APPLICATION
    // ===========================================
    function applyHolyWeekTheme() {
        const html = document.documentElement;
        
        if (isResurrectionSunday()) {
            applyResurrectionTheme();
            return;
        }

        html.style.setProperty('--holy-primary', '#4A148C');
        html.style.setProperty('--holy-bg', '#FFFDE7');
        html.style.setProperty('--holy-accent', '#D4AF37');
        html.style.setProperty('--holy-text', '#3E2723');
        
        html.style.setProperty('--dark-blue', '#4A148C');
        html.style.setProperty('--gold', '#D4AF37');
        html.style.setProperty('--white', '#FFFDE7');
        
        document.body.classList.add('holy-week-theme');
        document.body.classList.remove('normal-theme', 'resurrection-theme');
        
        document.body.style.background = `
            linear-gradient(135deg, rgba(255, 253, 231, 0.97), rgba(255, 245, 210, 0.97)),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M50 10 L50 90 M20 35 L80 35 M20 55 L80 55' stroke='%23D4AF37' stroke-width='2' fill='none' opacity='0.06'/%3E%3C/svg%3E")
        `;
        document.body.style.backgroundRepeat = 'repeat';
    }

    function applyResurrectionTheme() {
        const html = document.documentElement;
        
        html.style.setProperty('--holy-primary', '#FFFFFF');
        html.style.setProperty('--holy-bg', '#FFFEF0');
        html.style.setProperty('--holy-accent', '#FFD700');
        html.style.setProperty('--holy-text', '#2C1810');
        html.style.setProperty('--resurrection-glow', '#FFE066');
        
        html.style.setProperty('--dark-blue', '#FFFFFF');
        html.style.setProperty('--gold', '#FFD700');
        html.style.setProperty('--white', '#FFFEF0');
        
        document.body.classList.add('resurrection-theme');
        document.body.classList.remove('normal-theme', 'holy-week-theme');
        
        document.body.style.background = `
            radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 1), rgba(255, 254, 240, 0.98)),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='50' stroke='%23FFD700' stroke-width='0.5' fill='none' opacity='0.08'/%3E%3Ccircle cx='60' cy='60' r='35' stroke='%23FFD700' stroke-width='0.5' fill='none' opacity='0.06'/%3E%3C/svg%3E")
        `;
        document.body.style.backgroundRepeat = 'repeat';
    }

    function removeHolyWeekTheme() {
        const html = document.documentElement;
        
        html.style.removeProperty('--holy-primary');
        html.style.removeProperty('--holy-bg');
        html.style.removeProperty('--holy-accent');
        html.style.removeProperty('--holy-text');
        html.style.removeProperty('--resurrection-glow');
        
        html.style.setProperty('--dark-blue', '#001a33');
        html.style.setProperty('--gold', '#d4af37');
        html.style.setProperty('--white', '#ffffff');
        
        document.body.classList.remove('holy-week-theme', 'resurrection-theme');
        document.body.classList.add('normal-theme');
        
        document.body.style.background = '';
    }

    // ===========================================
    // COUNTDOWN COMPONENT
    // ===========================================
    function createCountdownBanner() {
        removeExistingElements();
        
        const banner = document.createElement('div');
        banner.id = 'holyWeekCountdown';
        banner.innerHTML = `
            <div class="countdown-wrapper">
                <div class="countdown-header">
                    <span class="cross-icon-animated">☦</span>
                    <h2>أسبوع الالام</h2>
                    <span class="cross-icon-animated">☦</span>
                </div>
                <div class="countdown-subtitle">تحدٍّ روحاني خاص قريباً</div>
                <div class="countdown-timer-grid" id="countdownTimerGrid">
                    <div class="countdown-unit-box">
                        <span class="countdown-value-lg" id="hwDays">00</span>
                        <span class="countdown-label-sm">يوم</span>
                    </div>
                    <div class="countdown-colon">:</div>
                    <div class="countdown-unit-box">
                        <span class="countdown-value-lg" id="hwHours">00</span>
                        <span class="countdown-label-sm">ساعة</span>
                    </div>
                    <div class="countdown-colon">:</div>
                    <div class="countdown-unit-box">
                        <span class="countdown-value-lg" id="hwMinutes">00</span>
                        <span class="countdown-label-sm">دقيقة</span>
                    </div>
                    <div class="countdown-colon">:</div>
                    <div class="countdown-unit-box">
                        <span class="countdown-value-lg" id="hwSeconds">00</span>
                        <span class="countdown-label-sm">ثانية</span>
                    </div>
                </div>
                <div class="countdown-footer-text">يبدأ في 5 أبريل 2026</div>
            </div>
        `;
        
        insertIntoHomePage(banner);
        startCountdownTimer();
    }

    function removeExistingElements() {
        ['holyWeekCountdown', 'holyWeekActiveBanner', 'holyWeekMessage', 'resurrectionBanner'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });
    }

    function insertIntoHomePage(element) {
        const homePage = document.getElementById('homePage');
        if (homePage) {
            const card = homePage.querySelector('.card');
            if (card) {
                card.insertBefore(element, card.firstChild);
                return;
            }
        }
        document.body.insertBefore(element, document.body.firstChild);
    }

    function startCountdownTimer() {
        function update() {
            const time = getTimeUntilEvent();
            if (!time) {
                const banner = document.getElementById('holyWeekCountdown');
                if (banner) banner.remove();
                initHolyWeek();
                return;
            }
            
            const daysEl = document.getElementById('hwDays');
            const hoursEl = document.getElementById('hwHours');
            const minutesEl = document.getElementById('hwMinutes');
            const secondsEl = document.getElementById('hwSeconds');
            
            if (daysEl) daysEl.textContent = String(time.days).padStart(2, '0');
            if (hoursEl) hoursEl.textContent = String(time.hours).padStart(2, '0');
            if (minutesEl) minutesEl.textContent = String(time.minutes).padStart(2, '0');
            if (secondsEl) secondsEl.textContent = String(time.seconds).padStart(2, '0');
        }
        
        update();
        setInterval(update, 1000);
    }

    // ===========================================
    // HOLY WEEK ACTIVE BANNER
    // ===========================================
    function createHolyWeekBanner() {
        const isResurrection = isResurrectionSunday();
        
        const banner = document.createElement('div');
        banner.id = isResurrection ? 'resurrectionBanner' : 'holyWeekActiveBanner';
        
        if (isResurrection) {
            banner.className = 'resurrection-banner';
            banner.innerHTML = `
                <div class="resurrection-content">
                    <div class="resurrection-cross">✝</div>
                    <div class="resurrection-text">
                        <h3>المسيح قام!</h3>
                        <p>Καλή Ανάσταση - المسيح قام فعلاً!</p>
                    </div>
                    <div class="resurrection-cross">✝</div>
                </div>
            `;
        } else {
            banner.className = 'holy-week-banner';
            banner.innerHTML = `
                <div class="holy-week-announcement">
                    <span class="banner-cross">☦</span>
                    <div class="banner-text">
                        <h3>أسبوع الالام</h3>
                        <p>5 - 12 أبريل 2026</p>
                    </div>
                    <span class="banner-cross">☦</span>
                </div>
            `;
        }
        
        insertIntoHomePage(banner);
    }

    // ===========================================
    // ANSWER RESULT MODAL
    // ===========================================
    window.showHolyWeekResultModal = function(data, isCorrect) {
        const modal = document.createElement('div');
        modal.id = 'holyWeekResultModal';
        modal.className = 'holy-week-modal-overlay';
        
        const themeClass = isResurrectionSunday() ? 'resurrection-modal' : 'holy-week-modal';
        
        modal.innerHTML = `
            <div class="holy-week-modal-content ${themeClass}">
                <div class="modal-header">
                    <span class="modal-cross">☦</span>
                    <h2>${data.dayName}</h2>
                    <span class="modal-cross">☦</span>
                </div>
                
                <div class="modal-scripture">
                    <p class="scripture-ref">${data.scriptureReference}</p>
                </div>
                
                <div class="modal-explanation">
                    <h3>الشرح اللاهوتي</h3>
                    <p>${data.theologicalExplanation}</p>
                </div>
                
                <div class="modal-spiritual">
                    <div class="spiritual-icon">✝</div>
                    <p class="spiritual-message">${data.spiritualMessage}</p>
                </div>
                
                <div class="modal-result ${isCorrect ? 'correct' : 'incorrect'}">
                    ${isCorrect ? `
                        <span class="result-icon">✓</span>
                        <span class="result-text">أحسنت! إجابتك صحيحة</span>
                    ` : `
                        <span class="result-icon">○</span>
                        <span class="result-text">حظاً موفقاً غداً</span>
                    `}
                </div>
                
                <button class="modal-close-btn" onclick="closeHolyWeekModal()">تم理解的 - إغلاق</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeHolyWeekModal();
        });
    };

    window.closeHolyWeekModal = function() {
        const modal = document.getElementById('holyWeekResultModal');
        if (modal) {
            modal.classList.add('closing');
            setTimeout(() => modal.remove(), 300);
        }
    };

    // ===========================================
    // LEADERBOARD CROSS BADGES
    // ===========================================
    window.addCrossToLeaderboard = function() {
        if (!isHolyWeekActive()) return;
        
        const leaderboardList = document.getElementById('leaderboardList');
        if (!leaderboardList) return;
        
        const items = leaderboardList.querySelectorAll('.leaderboard-item');
        items.forEach(item => {
            const nameSpan = item.querySelector('span:nth-child(2)');
            if (nameSpan && !nameSpan.innerHTML.includes('☦')) {
                const crossBadge = isResurrectionSunday() 
                    ? '<span class="cross-gold">☦</span>' 
                    : '<span class="cross-gold">☦</span>';
                nameSpan.innerHTML = crossBadge + nameSpan.textContent;
            }
        });
    };

    // ===========================================
    // TOAST NOTIFICATIONS
    // ===========================================
    function showHolyWeekToast() {
        if (typeof window.showToast !== 'function') return;
        
        setTimeout(() => {
            if (isResurrectionSunday()) {
                window.showToast('✝ المسيح قام! كل عام وأنتم بخير!', 'success');
            } else {
                window.showToast('✝ أسبوع الالام بدأ! أسئلة روحانية خاصة', 'success');
            }
        }, 2000);
    }

    // ===========================================
    // LOAD HOLY WEEK QUESTIONS
    // ===========================================
    window.loadHolyWeekQuestion = function(day) {
        if (typeof db === 'undefined') {
            console.error('Firebase database not initialized');
            return Promise.reject('Database not initialized');
        }
        
        return db.ref(CONFIG.holyWeekPath + '/' + day).once('value');
    };

    // ===========================================
    // PATCH EXISTING FUNCTIONS
    // ===========================================
    function patchDailyContent() {
        if (typeof window.loadDailyContent === 'undefined') {
            setTimeout(patchDailyContent, 500);
            return;
        }
        
        const original = window.loadDailyContent;
        window.loadDailyContent = function(uid) {
            if (isHolyWeekActive()) {
                const day = getHolyWeekDay();
                loadHolyWeekQuestion(day).then(qSnap => {
                    const data = qSnap.val();
                    if (data) {
                        window._currentHolyWeekData = data;
                    }
                    original(uid);
                }).catch(() => original(uid));
            } else {
                original(uid);
            }
        };
    }

    function patchLeaderboardRender() {
        const original = window.renderLeaderboard;
        window.renderLeaderboard = function() {
            if (original) original();
            if (isHolyWeekActive()) {
                setTimeout(window.addCrossToLeaderboard, 600);
            }
        };
    }

    // ===========================================
    // INITIALIZATION
    // ===========================================
    function initHolyWeek() {
        if (isResurrectionSunday()) {
            applyResurrectionTheme();
        } else {
            applyHolyWeekTheme();
        }
        
        createHolyWeekBanner();
        showHolyWeekToast();
        patchLeaderboardRender();
        patchDailyContent();
    }

    function init() {
        if (isBeforeEvent()) {
            const checkHome = setInterval(() => {
                const homePage = document.getElementById('homePage');
                if (homePage) {
                    clearInterval(checkHome);
                    createCountdownBanner();
                }
            }, 500);
        } else if (isHolyWeekActive()) {
            initHolyWeek();
        }
        
        patchLeaderboardRender();
        patchDailyContent();
    }

    // ===========================================
    // EXPORTED API
    // ===========================================
    window.HolyWeek = {
        isActive: isHolyWeekActive,
        isBefore: isBeforeEvent,
        isResurrection: isResurrectionSunday,
        getDay: getHolyWeekDay,
        getTimeRemaining: getTimeUntilEvent,
        getPath: window.getQuestionsPath,
        applyTheme: applyHolyWeekTheme,
        showResultModal: window.showHolyWeekResultModal,
        refresh: function() {
            removeExistingElements();
            init();
        }
    };

    // Run
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
