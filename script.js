(function() {
    // Version: 2.0.3 - UI Toasts & Alert Removal
    const firebaseConfig = {
        apiKey: "AIzaSyDsFEgVfoEVaf6AME5OV6nwTjMaHM63A5U",
        authDomain: "rehla55day-e8bf2.firebaseapp.com",
        databaseURL: "https://rehla55day-e8bf2-default-rtdb.firebaseio.com",
        projectId: "rehla55day-e8bf2",
        storageBucket: "rehla55day-e8bf2.firebasestorage.app",
        messagingSenderId: "39933750061",
        appId: "1:39933750061:web:99a96c649dfcf58adfc1a4",
        measurementId: "G-H0JJ11E1SR"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.database();

    // --- UI Utility: Policy Modal ---
    window.overlayIn = function() {
        const modal = document.getElementById('policyModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    window.overlayOut = function() {
        const modal = document.getElementById('policyModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // --- UI Utility: Toast Notifications ---
    window.showToast = function(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 4500);
    };

    const spiritualMessages = [
        "الرسالة: آلام المسيح هي ثمن حريتك، تأمل في محبته.", "الرسالة: أنت مخلوق على صورة الله، لتكون نوراً للعالم.", "الرسالة: كلمة الله هي قوتك اليومية، تمسك بوعوده.", "الرسالة: المسيح هو رئيس كهنتنا الذي يشعر بضعفاتنا.", "الرسالة: اترك وراءك أرض العبودية وانطلق نحو أرض الموعد.", "الرسالة: لا تدع كبرياء العالم ينسيك أن الله هو ضابط الكل.", "الرسالة: وحدة الكنيسة هي قوة إيماننا، تمسك بالتقليد المسلم.", "الرسالة: باب التوبة مفتوح دائماً، مهما طال زمن الشر.", "الرسالة: كن بانيًا للأسوار الروحية في حياتك ولا تنهدم.", "الرسالة: لا تهرب من إرسالية الله، فحضوره يلاحقك بالحب.", "الرسالة: اطلب مسحة الروح القدس لتقود خطواتك كملك.", "الرسالة: اسمك 'مسيحي' هو شرف عظيم، عش بما يليق به.", "الرسالة: الشجاعة الروحية هي سلاحك ضد أعداء الخير.", "الرسالة: اجعل لسانك يلهج بالتسبيح في كل وقت.", "الرسالة: كن حاملاً لأثقال الآخرين، هكذا تتمم ناموس المسيح.", "الرسالة: المسيح يدعوك من مكان خطيتك لتبشر باسمه.", "الرسالة: تأمل في وعود الرب، فهي تعزي النفس.", "الرسالة: كن باراً في جيلك، فيرفعك الله فوق كل طوفان.", "الرسالة: كن سفيراً للمسيح أينما ذهبت في رحلات حياتك.", "الرسالة: الرب يشق لك طريقاً في وسط المستحيلات.", "الرسالة: صرخاتك الصادقة تصل لقلب الله دائماً.", "الرسالة: المسيح هو الملك الحقيقي الذي يحكم بالعدل.", "الرسالة: الصلاة قادرة أن تمد في عمرك الروحي وتعطيك شفاءً.", "الرسالة: كن وفياً كراعوث، فالله لا ينسى تعب المحبة.", "الرسالة: أفراح الكنيسة هي تذوق مسبق لأفراح السماء.", "الرسالة: أعلن قرارك اليوم: أما أنا وبيتي فنعبد الرب.", "الرسالة: صارع في الصلاة حتى تنال البركة وتتغير حياتك.", "الرسالة: قدس حياتك لتكون خادماً في هيكل الرب.", "الرسالة: احذر من الأفكار التي تحرضك على الشر والبعد عن الله.", "الرسالة: الروح القدس يعمل فيك لتبشر بلسان فصيح.", "الرسالة: الصوم هو وقت الاستنارة واللقاء مع الله على الجبل.", "الرسالة: اجعل قلبك هيكلاً يسكنه المسيح ويملأه مجداً.", "الرسالة: ثق أن يد الله تعمل في الخفاء لإنقاذك دائماً.", "الرسالة: الله قادر أن يحيي فيك كل ما هو ميت ويابس.", "الرسالة: كن رسولاً للمحبة واكتب رسالة حية بسلوكك.", "الرسالة: الرب هو مرساتك الوحيدة في عواصف الحياة.", "الرسالة: في حزنك، الجأ للرب فهو يعزي المنكسرين.", "الرسالة: الإيمان يحيط بك كأسوار تحميك من كل عدو.", "الرسالة: كن مستعداً للشهادة عن إيمانك حتى النفس الأخير.", "الرسالة: اسم يسوع هو سر قوتك وخلاصك، نادِ به دائماً.", "الرسالة: الرب يراك في خلوتك ويعرف أشواق قلبك الصادقة.", "الرسالة: التواضع يرفعك، والكبرياء يحول الإنسان لحيوان.", "الرسالة: لا تستصغر نفسك، فالله يعمل بالأدوات الصغيرة.", "الرسالة: كن حياً بالروح، واكتب إنجيلاً معاشاً للناس.", "الرسالة: سلام الله الذي يفوق كل عقل يملأ قلبك وفكرك.", "الرسالة: العطاء يبارك حياتك، والرب يقيمك من عثراتك.", "الرسالة: التسامح هو طريق المصالحة مع الله والناس.", "الرسالة: الرب يحارب عنكم وأنتم تصمتون، ثق في نصرته.", "الرسالة: اقبل الآخرين كما قبلك المسيح وغفر لك.", "الرسالة: المسيح اختارك لتكون نوراً في إقليمك ومحيطك.", "الرسالة: كن أميناً في غربتك، فالله يرفعك في الوقت المناسب.", "الرسالة: الأسرار الكنسية هي ينابيع النعمة التي تقدس روحك.", "الرسالة: الشهادة للحق قد تكلفك الكثير، لكن أجرها عظيم.", "الرسالة: انتظر الرب بصبر، فوعده بالخلاص يقين.", "الرسالة: اسمع صوت الله في الهدوء، بعيداً عن ضجيج العالم."
    ];

    const spiritualExplanations = [
        "التفسير: تنبأ إشعياء بدقة مذهلة عن صليب المسيح (إشعياء 53) قبل مئات السنين.", "التفسير: في البدء خلق الله النور، ليعلن أن طبيعته هي النور ولا ظلمة فيه (تكوين 1).", "التفسير: الأسفار الـ 39 هي كنز العهد القديم الذي مهد الطريق لمجيء المخلص.", "التفسير: رسالة العبرانيين تشرح كيف أن المسيح هو الذبيحة الكاملة والنهائية.", "التفسير: موسى عاين الأرض من بعيد، لكنه دخل كنعان السماوية (تثنية 34).", "التفسير: الله يزن القلوب، ومملكته هي التي تدوم للأبد (دانيال 5).", "التفسير: المجامع الثلاثة حفظت لنا الإيمان القويم من كل هرطقة.", "التفسير: منسى هو نموذج للتوبة القوية التي تمحو تاريخاً طويلاً من الخطايا.", "التفسير: الصلاة والعمل معاً هما سر نجاح نحميا في بناء السور.", "التفسير: لا مكان بعيداً عن وجه الرب، فحضوره يملأ كل مكان.", "التفسير: شاول اختير بمسحة مقدسة، لكن الأمانة هي التي تحفظ النعمة.", "التفسير: أنطاكية شهدت ميلاد الاسم الذي نعتز به حتى اليوم (أعمال 11).", "التفسير: الله يستخدم الضعفاء ليخزي بهم الأقوياء والمستكبرين.", "التفسير: المزامير هي لغة القلب في كل حالاته من ضيق أو فرح.", "التفسير: عاموس الراعي البسيط صار نبياً قوياً ينادي بالعدل.", "التفسير: المسيح ينظر للقلب لا للمهنة، فحول العشار إلى إنجيلي.", "التفسير: مزمور 117 دعوة لجميع الأمم لتسبيح الرب على رحمته.", "التفسير: أخنوخ سار مع الله، فرفعه الله إليه، ليعلن أن الموت ليس نهاية.", "التفسير: بولس الرسول لم يهدأ حتى ملأ العالم ببشارة الملكوت.", "التفسير: عبور البحر الأحمر هو رمز للمعمودية والعبور من الموت للحياة.", "التفسير: إرميا تألم من أجل شعبه، وهو رمز للمسيح الحزين على خطايانا.", "التفسير: إنجيل متى هو الجسر بين العهد القديم والجديد.", "التفسير: صلاة حزقيا تثبت أن الله يتحنن ويسمع أنين المرضى.", "التفسير: راعوث الغريبة صارت جدة للمسيح بسبب إخلاصها ومحبتها.", "التفسير: الأعياد السيدية هي محطات روحية نعيش فيها حياة المسيح.", "التفسير: القرار الروحي يحتاج شجاعة وثبات كقرار يشوع بن نون.", "التفسير: الجهاد في الصلاة هو الذي يغير الاسم والطبيعة.", "التفسير: سبط لاوي يذكرنا أن الخدمة هي تفرغ كامل لمحبة الله.", "التفسير: إيزابل ترمز للإغراءات التي تبعدنا عن عبادة الله الحي.", "التفسير: أعمال الرسل هو سفر مفتوح يكتبه كل مؤمن بشهادته اليومية.", "التفسير: الأربعون يوماً هي فترة اعتزال للصعود إلى حضرة الله.", "التفسير: هيكل سليمان كان عظيماً، لكننا نحن الآن هيكل الله وروح الله يسكن فينا.", "التفسير: سفر إستير يعلمنا أن الله يدبر الخلاص لشعبه حتى لو صمت.", "التفسير: روح الرب يحيي العظام اليابسة، فلا يأس مع عمل الله.", "التفسير: رسائل بولس هي دستور الحياة الروحية والكنيسة.", "التفسير: جبل أراراط هو رمز للراحة والاستقرار بعد عواصف التجارب.", "التفسير: المراثي تعلمنا كيف نسكب نفوسنا أمام الله في وقت الضيق.", "التفسير: أريحا سقطت بالإيمان لا بالسلاح، فالرب هو المحارب عنا.", "التفسير: استفانوس تشبه بالمسيح حتى في الغفران لراجميه.", "التفسير: يسوع هو الاسم الذي فيه الخلاص لكل من يدعو به.", "التفسير: نثنائيل كان يبحث عن الحق، فوجده الحق تحت التينة.", "التفسير: نبوخذ نصر تعلم أن العلي هو المتسلط في مملكة الناس.", "التفسير: الأنبياء الصغار رسائلهم كبيرة في التوبة والرجاء.", "التفسير: يوحنا الحبيب هو لاهوتي الحب الذي عاين الأسرار.", "التفسير: أورشليم الأرضية تذكرنا بأورشليم السمائية مدينة السلام.", "التفسير: إيليا بقوة صلاته غلق السماء وفتحها وأقام الموتى.", "التفسير: التواضع أمام الإخوة هو مفتاح المصالحة والبركة.", "التفسير: الرب لا يخلص بكثرة، فبـ 300 رجل هزم جدعون جيوشاً.", "التفسير: المسيحية تحول العبيد إلى إخوة أحباء في جسد المسيح الواحد.", "التفسير: من الجليل بدأ النور يشرق على الجالسين في الظلمة.", "التفسير: دانيال في بابل يثبت أن القداسة ممكنة في أصعب الأماكن.", "التفسير: الأسرار هي القنوات المنظورة لنوال النعمة غير المنظورة.", "التفسير: يوحنا المعمدان صار شهيداً للحق في وجه الفساد.", "التفسير: ملاخي يختم العهد القديم بالوعد بمجيء شمس البر.", "التفسير: الله لا يحب الضجيج، بل يتكلم في سكون القلب المتواضع."
    ];

    const sundayNames = ["أحد الكنوز", "أحد التجربة", "أحد الابن الضال", "أحد السامرية", "أحد المخلع", "أحد المولود أعمى", "أحد الشعانين", "أحد القيامة"];
    
    const sundayMessages = {
        "أحد الكنوز": {
            verse: "اكنزوا لكم كنوزًا في السماء حيث لا يفسد سوس ولا صدأ (متى 6:20)",
            message: "الكنز الحقيقي هو علاقتك بالله، لا تنشغل بكنوز الأرض الزائلة."
        },
        "أحد التجربة": {
            verse: "ليس بالخبز وحده يحيا الإنسان بل بكل كلمة تخرج من فم الله (متى 4:4)",
            message: "التجربة ليست ضعفًا بل فرصة لإعلان قوة إيمانك."
        },
        "أحد الابن الضال": {
            verse: "لأن ابني هذا كان ميتًا فعاش وكان ضالًا فوُجد (لوقا 15:24)",
            message: "مهما ابتعدت، حضن الآب مفتوح دائمًا."
        },
        "أحد السامرية": {
            verse: "من يشرب من الماء الذي أعطيه أنا فلن يعطش إلى الأبد (يوحنا 4:14)",
            message: "المسيح وحده يروي عطش قلبك."
        },
        "أحد المخلع": {
            verse: "قم احمل سريرك وامشِ (يوحنا 5:8)",
            message: "كلمة المسيح قادرة أن تقيمك من أي ضعف."
        },
        "أحد المولود أعمى": {
            verse: "ما دمت في العالم فأنا نور العالم (يوحنا 9:5)",
            message: "افتح عينيك بنور المسيح لترى الطريق بوضوح."
        },
        "أحد الشعانين": {
            verse: "هوذا ملكك يأتيك وديعًا (متى 21:5)",
            message: "استقبل المسيح في قلبك بفرح وتسبيح."
        },
        "أحد القيامة": {
            verse: "لماذا تطلبن الحي بين الأموات؟ ليس هو ههنا لكنه قام (لوقا 24:5-6)",
            message: "القيامة هي بداية الحياة الجديدة والانتصار الأبدي."
        }
    };

    let timerInterval;

    function getCurrentJourneyDay() {
        const start = new Date('2026-02-16');
        start.setHours(0, 0, 0, 0);
        const nowInCairo = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Cairo' }));
        nowInCairo.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((nowInCairo - start) / (1000 * 60 * 60 * 24)) + 1;
        return diffDays > 0 ? (diffDays <= 55 ? diffDays : 55) : 1;
    }

    function updateDayCountdown() {
        const now = new Date();
        const cairoNow = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Cairo' }));
        const tonight = new Date(cairoNow);
        tonight.setHours(24, 0, 0, 0);
        const diff = tonight - cairoNow;
        const progress = (diff / (24 * 60 * 60 * 1000)) * 100;
        const progressBar = document.getElementById('dayProgressBar');
        if (progressBar) progressBar.style.width = (100 - progress) + "%";

        const h = Math.floor((diff / 3600000) % 24);
        const m = Math.floor((diff / 60000) % 60);
        const s = Math.floor((diff / 1000) % 60);
        const timerText = document.getElementById('dayTimeRemaining');
        if (timerText) timerText.innerText = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;

        if (diff <= 0) location.reload();
    }

    window.showPage = function(id) {
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
            p.style.display = 'none';
        });
        const target = document.getElementById(id);
        if (target) {
            target.classList.add('active');
            target.style.display = 'block';
        }
    };

    function getCairoDateString() {
        return new Date().toLocaleDateString('en-CA', {timeZone: 'Africa/Cairo'});
    }

    window.register = function() {
        const email = document.getElementById('regEmail').value.trim();
        const pass = document.getElementById('regPass').value;
        const name = document.getElementById('regName').value.trim();

        if (name.length > 50 || email.length > 100) return showToast("الاسم أو الإيميل طويل جداً!", "error");
        if (name === "" || email === "") return showToast("يرجى ملء جميع البيانات", "error");
        if (pass.length < 6 || !/[A-Z]/.test(pass) || !/[0-9]/.test(pass)) return showToast("شروط كلمة السر غير مكتملة!", "error");

        firebase.auth().createUserWithEmailAndPassword(email, pass).then(u => {
            u.user.updateProfile({ displayName: name });
            const userUid = u.user.uid;
            
            // Send verification email
            u.user.sendEmailVerification().then(() => {
                showToast("تم إرسال رابط التفعيل إلى بريدك الإلكتروني!", "success");
            });

            db.ref('users/' + userUid).set({
                name: name,
                email: email,
                score: 0,
                solvedDays: "",
                role: 'user',
                lastAnsweredDay: 0,
                agreedToPolicy: false // User must still go through the policy page
            }).then(() => {
                db.ref('leaderboard/' + userUid).set({ name: name, score: 0 });
            }).catch(e => {
                console.error("Database initialization failed:", e);
                showToast("تم إنشاء الحساب لكن حدث خطأ في إعداد الملف الشخصي.", "error");
            });
        }).catch(e => showToast("خطأ: " + e.message, "error"));
    };

    window.resendVerification = function() {
        const user = firebase.auth().currentUser;
        if (user) {
            user.sendEmailVerification()
                .then(() => showToast("تم إرسال رابط تفعيل جديد.", "success"))
                .catch(e => showToast("خطأ: " + e.message, "error"));
        }
    };

    window.login = function() {
        const e = document.getElementById('loginEmail').value;
        const p = document.getElementById('loginPass').value;
        firebase.auth().signInWithEmailAndPassword(e, p)
            .catch(() => showToast("بيانات خاطئة، تأكد من البريد وكلمة السر", "error"));
    };

    window.forgotPassword = function() {
        const email = document.getElementById('resetEmail').value;
        if(!email) return showToast("أدخل البريد الإلكتروني أولاً", "error");
        firebase.auth().sendPasswordResetEmail(email)
            .then(() => showToast("تم إرسال رابط استعادة كلمة السر لبريدك!", "success"))
            .catch(e => showToast(e.message, "error"));
    };

    window.logout = function() { firebase.auth().signOut(); };

    window.signInWithGoogle = function(response) {
        // If response is present, it's from the new GSI library (ID Token)
        if (response && response.credential) {
            const credential = firebase.auth.GoogleAuthProvider.credential(response.credential);
            firebase.auth().signInWithCredential(credential)
                .then((result) => {
                    handleUserPostLogin(result.user);
                }).catch((error) => {
                    console.error("GSI Error:", error);
                    showToast("خطأ في تسجيل الدخول: " + error.message, "error");
                });
        } else {
            // Fallback for direct calls (if any) or old popup method
            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider)
                .then((result) => {
                    handleUserPostLogin(result.user);
                }).catch((error) => {
                    console.error("Popup Error:", error);
                    showToast("خطأ في تسجيل الدخول: " + error.message, "error");
                });
        }
    };

    function handleUserPostLogin(user) {
        db.ref('users/' + user.uid).once('value').then(snap => {
            if (!snap.exists()) {
                // New User: Redirect to Complete Profile Page
                showPage('completeProfilePage');
            } else {
                // Existing User: Proceed normally
                // Optional: Backfill agreedToPolicy for old users if needed, or just let them in.
                // db.ref('users/' + user.uid).update({ agreedToPolicy: true }); 
            }
        });
    }

    window.finalizePolicyAgreement = function() {
        const checkbox = document.getElementById('googleAgreePolicy');
        if (!checkbox.checked) {
            return showToast("يجب الموافقة على الشروط لإكمال التسجيل.", "error");
        }

        const user = firebase.auth().currentUser;
        if (!user) return showPage('loginPage');

        const userRef = db.ref('users/' + user.uid);
        userRef.once('value').then(snap => {
            const userName = user.displayName || user.email.split('@')[0];
            if (snap.exists()) {
                // SAFE: Existing user just adding the agreement flag
                return userRef.update({
                    agreedToPolicy: true,
                    agreedTime: firebase.database.ServerValue.TIMESTAMP
                });
            } else {
                // New user: Full profile initialization
                return userRef.set({
                    name: userName,
                    email: user.email,
                    score: 0,
                    solvedDays: "",
                    role: 'user',
                    lastAnsweredDay: 0,
                    agreedToPolicy: true,
                    agreedTime: firebase.database.ServerValue.TIMESTAMP
                }).then(() => {
                    return db.ref('leaderboard/' + user.uid).set({ name: userName, score: 0 });
                });
            }
        }).then(() => {
            showToast("تم تحديث الحساب بنجاح!", "success");
            showPage('homePage');
            loadDailyContent(user.uid);
        }).catch(e => {
            console.error("Signup Finalization Error:", e);
            showToast("حدث خطأ أثناء إعداد الحساب.", "error");
        });
    };

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // User is signed in.
            // Check 1: Is email verified? (Skip for Google users)
            if (!user.emailVerified && user.providerData.some(p => p.providerId === 'password')) {
                showPage('verifyEmailPage');
                return; // Stop further execution until verified
            }

            // Check 2: User Status (Banned or Policy Agreement)
            db.ref('users/' + user.uid).once('value').then(snap => {
                const userData = snap.val();
                
                if (userData && userData.role === 'banned') {
                    firebase.auth().signOut();
                    showPage('bannedPage');
                    return;
                }

                if (!userData || userData.agreedToPolicy !== true) {
                    showPage('completeProfilePage');
                    return;
                }

                // If verified, not banned, and agreed to policy:
                showPage('homePage');
                loadDailyContent(user.uid);
                const nameDisplay = document.getElementById('userNameDisplay');
                if (nameDisplay) nameDisplay.textContent = "مرحباً: " + (user.displayName || "صديقي");

                if (userData.role === 'admin') {
                    const adminBtn = document.getElementById('adminBtn');
                    if (adminBtn) adminBtn.style.display = 'inline-block';
                    syncAllUsersToLeaderboard();
                }
                if (userData.name) {
                    db.ref('leaderboard/' + user.uid + '/name').set(userData.name).catch(() => {});
                }
            });

            if (!window.dayTimerStarted) {
                setInterval(updateDayCountdown, 1000);
                window.dayTimerStarted = true;
            }
        } else {
            // User is signed out.
            showPage('loginPage');
            if (window.dayTimerStarted) window.dayTimerStarted = false;
        }
        renderLeaderboard();
    });

    let leaderboardData = [];
    let isLeaderboardListenerAttached = false;

    function loadLeaderboard() {
        if (isLeaderboardListenerAttached) return;
        isLeaderboardListenerAttached = true;
        const query = db.ref('leaderboard').orderByChild('score');
        query.on('value', (snapshot) => {
            const temp = [];
            snapshot.forEach(child => {
                const val = child.val();
                temp.push({ uid: child.key, name: val.name || "متسابق", score: val.score || 0 });
            });
            temp.sort((a, b) => b.score - a.score);
            leaderboardData = temp;
            renderLeaderboard();
        });
    }

    function renderLeaderboard() {
        const leaderboardList = document.getElementById('leaderboardList');
        if (!leaderboardList) return;
        if (leaderboardData.length === 0) {
            leaderboardList.innerHTML = "<p style='text-align:center;'>جاري تحميل القائمة...</p>";
            return;
        }
        leaderboardList.innerHTML = "";
        const currentUser = firebase.auth().currentUser;
        let userFoundInTop10 = false;
        const top10 = leaderboardData.slice(0, 10);
        top10.forEach((user, index) => {
            const isMe = currentUser && user.uid === currentUser.uid;
            if (isMe) userFoundInTop10 = true;
            appendLeaderboardItem(leaderboardList, index + 1, user.name, user.score, isMe);
        });
        if (currentUser && !userFoundInTop10) {
            const userRank = leaderboardData.findIndex(u => u.uid === currentUser.uid) + 1;
            if (userRank > 0) {
                const me = leaderboardData[userRank - 1];
                const separator = document.createElement('div');
                separator.style.textAlign = 'center'; separator.style.padding = '5px 0'; separator.textContent = '...';
                leaderboardList.appendChild(separator);
                appendLeaderboardItem(leaderboardList, userRank, me.name, me.score, true);
            }
        }
    }

    function appendLeaderboardItem(container, rank, name, score, isMe) {
        const item = document.createElement('div');
        item.className = "leaderboard-item" + (isMe ? " current-user" : "");
        const rankSpan = document.createElement('span');
        rankSpan.className = "rank"; rankSpan.textContent = rank + ". ";
        const nameSpan = document.createElement('span');
        nameSpan.textContent = name; nameSpan.style.flex = "1";
        const scoreSpan = document.createElement('span');
        scoreSpan.textContent = score + " نقطة"; scoreSpan.style.fontWeight = "bold";
        item.appendChild(rankSpan); item.appendChild(nameSpan); item.appendChild(scoreSpan);
        container.appendChild(item);
    }

    function syncAllUsersToLeaderboard() {
        return db.ref('users').once('value').then(snapshot => {
            if (!snapshot.exists()) return;
            const updates = {};
            snapshot.forEach(child => {
                const userData = child.val();
                if (userData.name) {
                    updates['leaderboard/' + child.key] = {
                        name: userData.name,
                        score: userData.score || 0
                    };
                }
            });
            return db.ref().update(updates);
        }).catch(e => {
            if (e.code !== 'PERMISSION_DENIED') console.error("Sync error:", e);
        });
    }

    window.openAdminPanel = function() {
        showPage('adminPage');
        const usersListDiv = document.getElementById('usersList');
        usersListDiv.innerHTML = "<p style='text-align:center; color:white;'>⏳ جاري تحميل قائمة الأبطال...</p>";
        db.ref('users').once('value').then(snapshot => {
            usersListDiv.innerHTML = ""; 
            if (!snapshot.exists()) { usersListDiv.innerHTML = "<p style='text-align:center;'>لا يوجد مستخدمين حالياً.</p>"; return; }
            snapshot.forEach(childSnapshot => {
                const userId = childSnapshot.key; const userData = childSnapshot.val();
                if (!userData) return; // Skip if user data is null
                const userRow = document.createElement('div');
                userRow.className = "admin-user-card";
                userRow.style.cssText = "border-bottom: 1px solid rgba(212,175,55,0.3); padding: 15px; margin-bottom: 10px; background: rgba(0,0,0,0.2); border-radius: 10px;";
                
                const nameDiv = document.createElement('div');
                nameDiv.style.cssText = "color:#d4af37; font-weight:bold; font-size:1.1rem;";
                nameDiv.textContent = `👤 ${userData.name || 'مجهول'}`;
                
                const emailDiv = document.createElement('div');
                emailDiv.style.cssText = "font-size:0.85rem; color:#ccc; margin-bottom:8px;";
                emailDiv.textContent = `📧 ${userData.email}`;

                const roleDiv = document.createElement('div');
                roleDiv.style.cssText = "font-size:0.85rem; color:" + (userData.role === 'banned' ? '#ff4444' : '#00ff00') + "; margin-bottom:12px; font-weight:bold;";
                roleDiv.textContent = `الحالة: ${userData.role || 'user'}`;

                const controlsDiv = document.createElement('div');
                controlsDiv.style.cssText = "display:flex; justify-content:space-between; align-items:center; gap: 10px;";
                
                const scoreSpan = document.createElement('span');
                scoreSpan.style.color = "white"; scoreSpan.textContent = "النقاط: ";
                const scoreInput = document.createElement('input');
                scoreInput.type = "number"; scoreInput.id = 'score_' + userId; scoreInput.value = userData.score || 0;
                scoreInput.style.cssText = "width:70px; background:#1a1a1a; border:1px solid #d4af37; color:white; padding:4px; border-radius:5px;";
                
                const saveBtn = document.createElement('button');
                saveBtn.style.cssText = "width:auto; padding:5px 15px; background:linear-gradient(45deg, #27ae60, #2ecc71); border:none; color:white; border-radius:5px; cursor:pointer; margin: 0;";
                saveBtn.textContent = "حفظ";
                saveBtn.onclick = () => updateUserScore(userId, userData.name);

                const banBtn = document.createElement('button');
                const isBanned = userData.role === 'banned';
                banBtn.style.cssText = `width:auto; padding:5px 15px; background:${isBanned ? 'linear-gradient(45deg, #f39c12, #f1c40f)' : 'linear-gradient(45deg, #c0392b, #e74c3c)'}; border:none; color:white; border-radius:5px; cursor:pointer; margin: 0;`;
                banBtn.textContent = isBanned ? "إلغاء الحظر ✅" : "حظر 🚫";
                banBtn.onclick = () => toggleBan(userId, isBanned);
                
                scoreSpan.appendChild(scoreInput); 
                controlsDiv.appendChild(scoreSpan); 
                controlsDiv.appendChild(saveBtn);
                controlsDiv.appendChild(banBtn);
                
                userRow.appendChild(nameDiv); 
                userRow.appendChild(emailDiv);
                userRow.appendChild(roleDiv);
                userRow.appendChild(controlsDiv);
                usersListDiv.appendChild(userRow);
            });
        });
    };

    window.toggleBan = function(userId, isBanned) {
        const newRole = isBanned ? 'user' : 'banned';
        db.ref('users/' + userId + '/role').set(newRole).then(() => {
            showToast(`تم ${isBanned ? 'إلغاء حظر' : 'حظر'} المستخدم بنجاح!`, "success");
            openAdminPanel(); // Refresh the admin panel
        }).catch(e => {
            showToast("حدث خطأ: " + e.message, "error");
        });
    };


    window.updateUserScore = function(userId, userName) {
        const input = document.getElementById('score_' + userId);
        const newScore = parseInt(input.value);
        if(isNaN(newScore)) return showToast("يرجى إدخال رقم صحيح", "error");
        const updates = {};
        updates['users/' + userId + '/score'] = newScore;
        updates['leaderboard/' + userId + '/score'] = newScore;
        db.ref().update(updates).then(() => showToast("تم تحديث نقاط المستخدم بنجاح!", "success"));
    };

    window.goToHome = function() { showPage('homePage'); };

    function renderSundaySpecial(day) {
        const now = new Date();
        const cairoNow = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Cairo' }));
        const sundayBox = document.getElementById('sundaySpecialBox');
        if (!sundayBox) return;

        if (cairoNow.getDay() !== 0) {
            sundayBox.style.display = "none";
            return;
        }

        const sundayIndex = Math.floor((day - 1) / 7);
        const sundayName = sundayNames[sundayIndex] || "أحد مبارك";
        const data = sundayMessages[sundayName];
        if (!data) return;

        sundayBox.innerHTML = `
            <div style="border: 3px solid #d4af37; border-radius: 15px; padding: 20px; margin: 20px 0; background: linear-gradient(145deg, #111, #1c1c1c); text-align: center; box-shadow: 0 0 15px rgba(212,175,55,0.5);">
                <h2 style="color:#d4af37; margin-bottom:10px;">✨ ${sundayName} ✨</h2>
                <p style="color:white; font-size:1.1rem; margin-bottom:10px;">${data.verse}</p>
                <p style="color:#00ffcc; font-size:1rem;">${data.message}</p>
            </div>`;
        sundayBox.style.display = "block";
    }

    function loadDailyContent(uid) {
        const day = getCurrentJourneyDay();
        db.ref('questions/' + day).once('value').then(qSnap => {
            const data = qSnap.val();
            const quizArea = document.getElementById('quizArea');
            if (!data) return quizArea.innerHTML = "<p style='color:white;'>جاري تحميل السؤال...</p>";
            
            renderSundaySpecial(day);
            document.getElementById('dailyMsg').textContent = spiritualMessages[day - 1] || "";
            document.getElementById('dailyExp').textContent = spiritualExplanations[day - 1] || "";
            document.getElementById('questionText').textContent = data.q;
            
            const now = new Date();
            const cairoNow = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Cairo' }));
            const currentSunday = (cairoNow.getDay() === 0) ? "اليوم: " + (sundayNames[Math.floor((day - 1) / 7)] || "أحد مبارك") : "اليوم " + day + " من الرحلة";
            document.getElementById('sundayTag').textContent = currentSunday;
            
            db.ref('users/' + uid).once('value').then(uSnap => {
                const userData = uSnap.val() || { score: 0, solvedDays: "", lastAnsweredDay: 0 };
                document.getElementById('userScore').textContent = userData.score || 0;
                
                if (userData.lastAnsweredDay >= day) {
                    clearInterval(timerInterval);
                    const isCorrect = (userData.solvedDays || "").includes("," + day + ":correct,");
                    quizArea.innerHTML = `<div style="padding:20px; border:2px solid ${isCorrect?'#00ff00':'#ff4444'}; border-radius:15px; background:rgba(0,0,0,0.3); color:${isCorrect?'#00ff00':'#ff4444'}; text-align:center;">
                        <h3>${isCorrect?'✅ أحسنت! إجابتك صحيحة':'📍 حظاً موفقاً غداً'}</h3>
                        <p style="color:white; font-size:0.95rem;">${data.e}</p>
                    </div>`;
                } else {
                    // Check if there's a pending submission for THIS day
                    db.ref('submissions/' + uid).once('value').then(subSnap => {
                        const subData = subSnap.val();
                        if (subData && subData.day === day) {
                            clearInterval(timerInterval);
                            quizArea.innerHTML = `<div style="padding:20px; border:2px solid var(--gold); border-radius:15px; background:rgba(0,0,0,0.3); color:var(--gold); text-align:center;">
                                <h3>⏳ جاري مراجعة إجابتك...</h3>
                                <p style="color:white; font-size:0.95rem;">مدقق الإجابات يقوم بمعالجة طلبك الآن، يرجى عدم إغلاق الصفحة.</p>
                            </div>`;
                            db.ref('submissions/' + uid).on('value', (s) => { if (!s.exists()) location.reload(); });
                        } else {
                            // Check if user has clicked "Start"
                            if (userData.read_status === true && userData.read_day === day) {
                                document.getElementById('startQuizContainer').style.display = 'none';
                                document.getElementById('quizContent').style.display = 'block';
                                renderOptions(data, uid, day);
                                startTimer(day);
                            } else {
                                document.getElementById('startQuizContainer').style.display = 'block';
                                document.getElementById('quizContent').style.display = 'none';
                            }
                        }
                    });
                }
            });
        });
    }

    window.startQuiz = function() {
        const user = firebase.auth().currentUser;
        if (!user) return;
        const day = getCurrentJourneyDay();
        
        db.ref('users/' + user.uid).update({
            read_status: true,
            read_day: day,
            quiz_start_time: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
            loadDailyContent(user.uid);
        }).catch(e => {
            showToast("حدث خطأ أثناء بدء المسابقة، يرجى المحاولة لاحقاً.", "error");
        });
    };

    function startTimer(day) {
        let timeLeft = 30;
        clearInterval(timerInterval);
        const timerDisplay = document.getElementById('timerDisplay');
        timerInterval = setInterval(() => {
            timeLeft--;
            if (timerDisplay) timerDisplay.textContent = "⏳ الوقت المتبقي: " + timeLeft + " ثانية";
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                handleAutoFail();
            }
        }, 1000);
    }

    function renderOptions(data, uid, day) {
        const container = document.getElementById('optionsContainer');
        container.innerHTML = "";
        data.o.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.textContent = opt.replace(/"/g, '');
            btn.className = "option-btn";
            btn.onclick = () => submitAnswer(uid, day, i);
            container.appendChild(btn);
        });
    }

    async function submitAnswer(uid, day, choiceIndex) {
        clearInterval(timerInterval);
        const quizArea = document.getElementById('quizArea');
        if (quizArea) {
            quizArea.innerHTML = `<div style="padding:20px; border:2px solid var(--gold); border-radius:15px; background:rgba(0,0,0,0.3); color:var(--gold); text-align:center;">
                <h3>⏳ جاري إرسال إجابتك...</h3>
                <p style="color:white; font-size:0.95rem;">يرجى الانتظار بينما يتواصل التطبيق مع مدقق الإجابات.</p>
            </div>`;
        }
        
        const submissionRef = db.ref('submissions/' + uid);
        
        try {
            await submissionRef.set({
                day: day,
                choice: choiceIndex,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
            
            if (quizArea) {
                quizArea.innerHTML = `<div style="padding:20px; border:2px solid var(--gold); border-radius:15px; background:rgba(0,0,0,0.3); color:var(--gold); text-align:center;">
                    <h3>⏳ جاري مراجعة إجابتك...</h3>
                    <p style="color:white; font-size:0.95rem;">مدقق الإجابات يقوم بمعالجة طلبك الآن، يرجى عدم إغلاق الصفحة.</p>
                </div>`;
            }
            
            submissionRef.on('value', (snap) => {
                if (!snap.exists()) {
                    location.reload();
                }
            });
        } catch (e) {
            showToast("عذراً! لقد استهلكت فرصتك لليوم أو هناك خطأ في الاتصال.", "error");
            location.reload();
        }
    }

    function handleAutoFail() {
        const user = firebase.auth().currentUser;
        if (user) submitAnswer(user.uid, getCurrentJourneyDay(), -1);
    }

    window.checkPassRequirements = function(val) {
        const isLenOk = val.length >= 6, isCapOk = /[A-Z]/.test(val), isNumOk = /[0-9]/.test(val);
        const reqLen = document.getElementById('reqLen'), reqCap = document.getElementById('reqCap'), reqNum = document.getElementById('reqNum'), hint = document.getElementById('passHintContainer');
        if(reqLen) reqLen.style.color = isLenOk ? "#00ff00" : "#ff4444";
        if(reqCap) reqCap.style.color = isCapOk ? "#00ff00" : "#ff4444";
        if(reqNum) reqNum.style.color = isNumOk ? "#00ff00" : "#ff4444";
        if(hint) hint.style.display = (isLenOk && isCapOk && isNumOk) ? "none" : "block";
    };

    window.shareApp = function() {
        const link = window.location.href;
        if (navigator.share) {
            navigator.share({ title: 'رحلة الـ 55 يوم', text: 'شاركني مسابقة الصوم الكبير الروحية وتنافس معي في المعلومات الكتابية!', url: link });
        } else { 
            navigator.clipboard.writeText(link).then(() => {
                showToast("تم نسخ رابط الرحلة! شاركه مع أصدقائك.", "success");
            });
        }
    };

    loadLeaderboard();
})();
// Initialize Firebase first
firebase.initializeApp(firebaseConfig);

// Get messaging instance
const messaging = firebase.messaging();

// Register service worker and request token
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('firebase-messaging-sw.js')
        .then(function(registration) {
            console.log('Service Worker Registered!');
            
            messaging.getToken({ 
                vapidKey: 'BJ8-ysECAGjQlPqjoRD9YPekOszOOOskrnOgNHU-BnPqMpHqrzUJn9VUKlMUJBJumd5kzr-za6yaLh2G5J_Qwtg',
                serviceWorkerRegistration: registration 
            }).then((token) => {
                console.log('Notification Token:', token);
            }).catch(err => console.log('Token Error:', err));
        })
        .catch(err => console.log('Service Worker Error:', err));
}

// Handle foreground messages
messaging.onMessage((payload) => {
    console.log('Foreground message:', payload);
    new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: 'img/log-circle.png'
    });
});

