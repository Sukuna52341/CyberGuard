/* CyberGuard — categories, difficulty, timed mode, local 2-player, achievements */

const DIFFICULTY_POINTS = { easy: 15, medium: 20, hard: 25 };
const QUIZ_LENGTH = 5;
const TIMED_SECONDS_PER_QUESTION = 30;
const STORAGE_KEY = 'cyberguard_save_v1';

const ACHIEVEMENTS_DEF = [
    { id: 'first_steps', title: 'First mission', desc: 'Complete any quiz.', icon: 'fa-flag-checkered' },
    { id: 'perfectionist', title: 'Perfect run', desc: '100% accuracy on a single quiz.', icon: 'fa-bullseye' },
    { id: 'speed_runner', title: 'Beat the clock', desc: 'Finish Timed mode with at least 80% accuracy.', icon: 'fa-stopwatch' },
    { id: 'hard_boiled', title: 'Hard mode', desc: 'Complete a quiz on Hard difficulty.', icon: 'fa-fire' },
    { id: 'duelist', title: 'Duelist', desc: 'Finish a 2-player match.', icon: 'fa-users' },
    { id: 'champion', title: 'Champion', desc: 'Win a 2-player match (highest score).', icon: 'fa-crown' },
    { id: 'explorer', title: 'Explorer', desc: 'Complete quizzes in 4 different categories.', icon: 'fa-compass' },
    { id: 'scholar', title: 'Scholar', desc: 'Answer 25 questions correctly (lifetime).', icon: 'fa-graduation-cap' },
    { id: 'storyteller', title: 'Scenario solver', desc: 'Get 5 interactive scenarios correct (lifetime).', icon: 'fa-book-open' }
];

function Q(text, options, correct, explanation, difficulty, detailTips, scenarioSetup) {
    return {
        question: text,
        options,
        correct,
        explanation,
        difficulty,
        detailTips: detailTips || [],
        scenarioSetup: scenarioSetup || null
    };
}

const quizData = {
    phishing: {
        title: 'Phishing Defense',
        questions: [
            Q("You receive an email from 'PayPal Security' asking you to verify your account by clicking a link. The email looks official but has some typos. What should you do?",
                ['Click the link immediately to verify your account', 'Forward the email to your IT department and delete it', 'Reply to the email asking for more information', 'Ignore the email completely'],
                1,
                'This is a classic phishing attempt. Legitimate companies like PayPal will never ask you to verify your account via email links. Forward suspicious emails to your IT department and delete them.',
                'easy',
                ['Legit firms use in-app alerts or accounts you open yourself, not surprise links.', 'Typos in the sender name or body often signal rushed phishing.'],
                'You are at your desk and an email lands in your work inbox claiming your PayPal account will be locked today unless you act.'),
            Q('Which of the following is a red flag that an email might be a phishing attempt?',
                ["The sender's email address looks legitimate", "The email contains urgent language like 'Act Now!' or 'Your account will be suspended'", 'The email has proper grammar and spelling', 'The email comes from a company you do business with'],
                1,
                'Phishing emails often use urgent language to create panic and pressure you into acting quickly without thinking.',
                'easy',
                ['Fear and urgency bypass careful thinking—slow down and verify out-of-band.', 'A matching logo does not prove the email is real.']),
            Q('You receive an email from your bank asking you to update your password. What is the safest way to proceed?',
                ['Click the link in the email and update your password', 'Call the bank using the phone number from the email', "Go directly to the bank's official website and log in there", 'Reply to the email with your current password'],
                2,
                'Never click links in emails claiming to be from your bank. Go directly to the official site or use a phone number you already trust.',
                'medium',
                ['Bookmark key financial sites so you always use the same URL.', 'If unsure, call the number on the back of your card—not the email.']),
            Q('What should you do if you accidentally clicked on a suspicious link in an email?',
                ["Nothing - it's probably fine", 'Enter your login credentials if prompted', 'Immediately change your passwords and run a virus scan', 'Forward the email to all your contacts to warn them'],
                2,
                'Change passwords for sensitive accounts, run a scan, and watch for misuse. Spreading the email can amplify confusion.',
                'medium',
                ['Start with email and banking passwords first.', 'Reporting to IT or your provider helps protect others.']),
            Q('Which is the best way to verify if an email is legitimate?',
                ["Check if the sender's email address looks official", "Look for the company's logo in the email", 'Contact the company using a phone number or website you know is legitimate', 'Click links in the email to see where they lead'],
                2,
                'Verify using channels you already trust—not addresses or phone numbers inside the suspicious message.',
                'hard',
                ['Hovering over links can still be misleading; typed URLs and official apps are safer.', 'Attackers can spoof display names easily.']),
            Q('A message asks you to buy gift cards for your “boss” who is in a meeting and says it is urgent. What do you do?',
                ['Buy the cards and send the codes immediately', 'Reply asking for clarification via the usual work channel', 'Use a personal credit card to be faster', 'Forward only the gift-card part'],
                1,
                'Gift-card urgency is a hallmark of BEC-style phishing. Confirm through normal work chat or a known good number.',
                'easy',
                ['Executives rarely demand gift cards over email.', 'Voice or in-person verification breaks the scam.'],
                'Friday afternoon: an email that looks like your director demands gift cards for a “surprise client visit” and insists you keep it secret.'),
            Q('The From: line shows your friend’s name but the actual email domain is unrelated (e.g., randommail.net). What is likely happening?',
                ['The friend changed providers', 'Display-name spoofing with a fake address', 'The email is definitely safe because the name matches', 'It must be a newsletter'],
                1,
                'Display names are easy to spoof; always check the full address and headers when in doubt.',
                'medium',
                ['Compare with a recent legitimate message thread.', 'When odd, message the friend on another channel.']),
            Q('What is spear phishing?',
                ['Phishing only on weekends', 'Targeted phishing tailored to one person or role', 'A phishing email with no links', 'Using only SMS'],
                1,
                'Spear phishing uses personal details to seem credible—extra vigilance and verification are essential.',
                'hard',
                ['Job titles, projects, and colleagues’ names may appear in the lure.', 'Training and clear reporting paths reduce harm.']),
            Q('You spot a nearly identical domain: paypaI.com with a capital “i” instead of “l”. What does this suggest?',
                ['A brand update', 'Typosquatting / look-alike domain', 'Always safe if HTTPS shows a lock', 'It proves the message is internal'],
                1,
                'Homoglyph and look-alike domains trick quick readers. Do not trust the link.',
                'hard',
                ['Prefer typing the domain or using a password manager’s saved entry.', 'Report impersonation to the impersonated brand.']),
            Q('After reporting a phishing email to IT, what else helps your organization?',
                ['Send the full headers when possible', 'Delete the original before anyone sees it', 'Post a screenshot publicly with credentials visible', 'Assume IT already knows so skip reporting'],
                0,
                'Headers and samples improve blocking rules. Never expose secrets in screenshots.',
                'medium',
                ['Many orgs have a phishing button in Outlook/Gmail.', 'Quick reports reduce lateral phishing inside the org.'])
        ]
    },
    passwords: {
        title: 'Password Power',
        questions: [
            Q('Which password approach is strongest overall in modern guidance?',
                ['password123', 'MyDogSpot2023!', 'A long unique passphrase with a password manager', '123456789'],
                2,
                'Length and uniqueness beat clever short strings. Password managers generate and store strong secrets per site.',
                'easy',
                ['NIST encourages length and checking breach lists over forced complexity alone.', 'Reuse is the silent killer across sites.']),
            Q('How often should you change passwords for high-value accounts?',
                ['Never if it feels strong', 'On a fixed schedule only for everything', 'When prompted after suspected compromise or policy requirement', 'Every day'],
                2,
                'Change when there is evidence or requirement; focus on unique, strong credentials and MFA.',
                'medium',
                ['Rotating without reason can encourage weaker patterns.', 'MFA adds a major layer even if a password leaks.']),
            Q('What is the best way to manage multiple strong passwords?',
                ['Write them on sticky notes', 'Use the same password for all accounts', 'Use a reputable password manager', 'Save them in a plain text file'],
                2,
                'Password managers encrypt vaults and fill credentials only on matching sites.',
                'easy',
                ['Pick a strong master password and enable MFA on the manager.', 'Offline backup of the vault key is important.']),
            Q('Which practice weakens passwords?',
                ['Using personal information like your name or birthday', 'Using a mix of letters and numbers', 'Making it at least 12 characters long', 'Using special characters'],
                0,
                'Personal info is guessable from social media and breaches.',
                'easy',
                ['Attackers try pet names, sports teams, and dates.', 'Passphrases of unrelated words are harder to guess.']),
            Q('You suspect a password was exposed in a breach. What first?',
                ['Wait to see charges', 'Change the password and enable MFA if available', 'Make a tiny variation of the old password', 'Tell friends first'],
                1,
                'Rotate quickly, enable MFA, and watch for alerts; similar passwords propagate risk.',
                'hard',
                ['Check haveibeenpwned-style alerts responsibly.', 'Unique passwords contain the blast radius.']),
            Q('What does MFA protect against if your password leaks?',
                ['Nothing', 'Someone logging in without the second factor', 'Phishing entirely without exceptions', 'Physical theft of your monitor'],
                1,
                'MFA blocks many remote takeover attempts, though advanced phishing can still trick users—stay cautious.',
                'medium',
                ['Prefer app-based or hardware keys over SMS when offered.', 'Backup codes belong in a safe place, not your inbox.']),
            Q('Sharing one Netflix-style password with extended family—what is the risk lesson?',
                ['There is no risk for streaming', 'Shared passwords increase leak surface and MFA gaps', 'It is safer than a manager', 'Platforms encourage it always'],
                1,
                'Shared credentials blur accountability and survive in chats and notes.',
                'easy',
                ['Family plans and guest profiles reduce sharing of the real password.', 'Revoke sessions after breakups or staff changes.']),
            Q('A site caps passwords at 8 characters and forbids symbols. What should you assume?',
                ['Great security', 'Legacy limits—still use the longest random string allowed', 'You must use your name', 'It is always fake'],
                1,
                'Use max entropy allowed; consider whether you trust the provider’s engineering.',
                'hard',
                ['Long random > clever short, even within bad limits.', 'Avoid reuse because the site may store weakly.']),
            Q('Password hints like “mother’s maiden name” are often insecure because:',
                ['The site encrypts them strongly', 'Answers are guessable from public records', 'They are never reused', 'Hints are optional everywhere'],
                1,
                'Treat hints as passwords: random answers stored in your manager.',
                'medium',
                ['Banks still ask KBA questions—answer with generated strings if allowed.', 'Social posts leak pet and school names.']),
            Q('Why avoid browser “save password” on shared computers?',
                ['It always requires a hardware key', 'Anyone with physical access may retrieve them', 'Browsers never save passwords', 'It improves sharing'],
                1,
                'Use a private profile, guest mode, or don’t save on devices you don’t control.',
                'easy',
                ['Full disk encryption and OS user accounts still matter.', 'Log out of password managers on shared PCs.'])
        ]
    },
    threats: {
        title: 'Cyber Threats',
        questions: [
            Q('What is ransomware?',
                ['A type of antivirus software', 'Malware that encrypts files and demands payment to unlock them', 'A security protocol for networks', 'A type of firewall'],
                1,
                'Ransomware locks data and demands payment; restoring from backups and containment are key.',
                'easy',
                ['Paying does not guarantee recovery and may fund criminals.', 'Offline backups beat online-only copies that get encrypted too.'],
                'Your screen shows a countdown and a note: files are locked and payment in cryptocurrency is required by midnight.'),
            Q('You get a pop-up claiming your computer is infected. What should you do?',
                ['Click the pop-up to download the fix', 'Call the number in the pop-up', 'Close the pop-up and scan with known-good antivirus', 'Restart only without checking'],
                2,
                'Tech-support scam pop-ups push fake cleaners or remote access—close and scan with real tools.',
                'easy',
                ['Use Task Manager / Force Quit if the window traps you.', 'Block notifications from unknown sites afterward.']),
            Q("What is a 'man-in-the-middle' attack?",
                ['Someone steals your laptop physically', 'An attacker intercepts communication between two parties', 'Someone guesses your password', 'Malware spreads via attachments'],
                1,
                'MITM risks are why HTTPS, certificate pinning on apps, and VPNs on untrusted Wi‑Fi matter.',
                'medium',
                ['Public Wi‑Fi can aid local sniffing or rogue hotspots.', 'Verify certificate warnings—don’t click through blindly.']),
            Q('You downloaded a suspicious file by mistake. Next step?',
                ['Open it to see the icon', 'Delete it and run a full scan', 'Email it to everyone', 'Zip and archive forever'],
                1,
                'Delete unopened if possible; if opened, isolate and scan; monitor for persistence.',
                'medium',
                ['Check auto-run settings on removable media.', 'Sandbox or VM for risky analysis—not your daily drive.']),
            Q('What is social engineering?',
                ['A computer virus', 'Manipulating people to disclose confidential information', 'A security suite', 'Encryption'],
                1,
                'Humans are often the weakest link—policies, verification, and culture reduce success.',
                'easy',
                ['Pretexting, baiting, and tailgating are common forms.', 'Slow down when emotions spike.']),
            Q('What describes a zero-day vulnerability?',
                ['A bug with no patch yet, actively unknown or exploited', 'A virus from 1999', 'A firewall setting at default', 'A password set to zero'],
                0,
                'Zero-days are valuable to attackers; defense layers and rapid patching when available help.',
                'hard',
                ['EDR may catch behavior even when signatures lag.', 'Least privilege limits blast radius.']),
            Q('What is a botnet?',
                ['A secure backup service', 'Many compromised devices controlled as a group', 'A type of CAPTCHA', 'Hardware 2FA only'],
                1,
                'Infected PCs, routers, or IoT devices can launch DDoS or spam at scale.',
                'medium',
                ['Change default creds on IoT gear.', 'Segment home IoT from PCs when possible.']),
            Q('CEO fraud often asks finance to wire money fast. Best control?',
                ['Wire on email approval alone', 'Out-of-band verification with a known callback', 'Trust the display name', 'Skip vacation approvals'],
                1,
                'Voice or in-person callbacks to a known number beat email-only approvals.',
                'hard',
                ['Dual control on transfers reduces single-point failure.', 'Smaller test wires first can be policy.']),
            Q('What is cryptojacking?',
                ['Encrypting your vacation photos', 'Unauthorized use of your device to mine cryptocurrency', 'Legal cloud mining offered by your OS', 'A bitcoin wallet type'],
                1,
                'Hidden miners spike CPU and power—check extensions, tabs, and malware scans.',
                'medium',
                ['Browser miners via malicious ads exist—use blocklists or enterprise controls.', 'Fans running hot can be a clue.']),
            Q('Supply-chain risk means:',
                ['Only physical trucks', 'Compromise via trusted vendor updates or libraries', 'Employees bringing lunch', 'Using HTTPS'],
                1,
                'Verify checksums, pin dependencies, and monitor SBOM advisories where applicable.',
                'hard',
                ['Not every project needs bleeding-edge deps.', 'Subresource integrity on CDNs helps websites.'])
        ]
    },
    social: {
        title: 'Social Engineering',
        questions: [
            Q('A caller claims to be IT and asks for your MFA code “to fix your account.” You should:',
                ['Read the code immediately', 'Refuse and contact IT through official channels', 'Give half the digits', 'Hang up and post the number online'],
                1,
                'MFA codes are secrets; real IT will not ask for them live. Verify internally.',
                'easy',
                ['Caller ID can be spoofed.', 'Use ticketing systems when available.'],
                'Your phone rings; the “help desk” says there is an outage and they need the six-digit login prompt you just received.'),
            Q('Tailgating at a secure door means:',
                ['Walking for exercise', 'Following someone authorized without badging in yourself', 'Holding the door politely always approved', 'Using VPN'],
                1,
                'Politely require badging or escort per policy—social pressure is the exploit.',
                'easy',
                ['Report broken locks or propped doors.', 'Friendly does not mean verified.']),
            Q('A USB drive labeled “Salaries” is in the parking lot. What is safest?',
                ['Plug it in to identify the owner', 'Hand it to security / IT without plugging in', 'Give it to the first passerby', 'Copy files to cloud'],
                1,
                'USB drops are classic bait for autorun malware—never insert untrusted media.',
                'medium',
                ['Some orgs destroy found drives.', 'Hyperv isolated machines are for pros only.'],
                'On the way in you spot a branded USB stick in the lot labeled “Q3_Salaries_Confidential.” Curiosity is high.'),
            Q('Pretexting is:',
                ['Encrypting pretzels', 'Fabricating a scenario to extract information', 'Two-factor authentication', 'Firewall logs'],
                1,
                'Attackers build believable stories—verify identity and need-to-know before sharing.',
                'medium',
                ['"Audit this week" or "new vendor portal" can be fake frames.', 'Slow down and use official directories.']),
            Q('Vishing targets:',
                ['Voice calls', 'Only video games', 'Vue.js apps', 'Vintage hardware only'],
                0,
                'Phone scams push urgency; banks won’t ask for full PINs or codes over random calls.',
                'easy',
                ['Hang up and dial a published support line.', 'Deepfakes are improving—be skeptical of urgent wire requests.']),
            Q('You feel rude refusing a “vendor” who knows your boss’s name. Best response?',
                ['Share project details to be nice', 'Verify through procurement or manager with a known contact', 'Assume LinkedIn scrapes mean legitimacy', 'Send NDA-covered files to prove trust'],
                1,
                'Public data feeds spear campaigns; follow enterprise procurement steps.',
                'hard',
                ['Calendar scraping can time calls around meetings.', 'Separate "friendly" from "authenticated."']),
            Q('A quiz “personality test” on social media asks for your first car and street you grew up on. Risk:',
                ['No risk—it is fun', 'Answers overlap with security questions attackers reuse', 'Only affects celebrities', 'Platforms block all scams'],
                1,
                'Meme quizzes harvest KBA-style answers—don’t feed them.',
                'medium',
                ['Lie consistently on KBA with random strings stored safely.', 'Teach family the same lesson.']),
            Q('In person, someone wearing a high-vis vest asks to borrow your badge “for a photo.” You:',
                ['Comply quickly', 'Decline and offer to escort them to reception', 'Lend badge if they smile', 'Take their photo instead without asking'],
                1,
                'Badges are credentials; unauthorized visuals/duplication aid intruders.',
                'hard',
                ['Social norms can be exploited—policy beats awkwardness.', 'Report odd interactions.']),
            Q('Watering hole attacks compromise:',
                ['Drinking fountains', 'Websites specific groups frequent', 'Only mobile SMS', 'Power outlets'],
                1,
                'Patch browsers and use ad blockers; be wary of niche software download sites.',
                'medium',
                ['Corporate threat intel may warn of sector-focused sites.', 'Isolate banking from general browsing if feasible.']),
            Q('What reduces success of phishing simulations in a healthy way?',
                ['Punitive firing for first clicks', 'Training plus blame-free reporting culture', 'Hiding results from leadership', 'Banning email'],
                1,
                'Measure improvement and celebrate reporting, not shame spirals.',
                'easy',
                ['Make phishing reporting one-click.', 'Tailor lessons to repeat failure patterns without ridicule.'])
        ]
    },
    privacy: {
        title: 'Privacy & Data',
        questions: [
            Q('What is data minimization?',
                ['Collecting all possible data “just in case”', 'Collecting only what is needed for a clear purpose', 'Deleting users randomly', 'Using the largest photos possible'],
                1,
                'Less stored data means less exposure when breaches occur.',
                'easy',
                ['Ask why each field exists in forms you build.', 'Retention schedules beat hoarding.']),
            Q('Cookies can be used to:',
                ['Store session state and track browsing across sites', 'Replace HTTPS', 'Guarantee anonymity', 'Encrypt your CPU'],
                0,
                'Understand first vs third-party cookies; use browser controls or containers.',
                'medium',
                ['Tracker blockers reduce silent profiling.', 'SameSite and partitioning improve defaults.']),
            Q('Before posting vacation photos in real time, consider:',
                ['Burglars may know your home is empty', 'It improves home security', 'It only matters for influencers', 'GPS never embeds in photos'],
                0,
                'Real-time travel posts signal absence; share after you return when appropriate.',
                'easy',
                ['Strip EXIF before sharing sensitive shots.', 'Stories still leak timing.'],
                'You are at the airport gate and want to post boarding passes and hotel swim-up selfies live to friends.'),
            Q('A free app asks for contacts, SMS, and precise location for a flashlight feature. You should:',
                ['Grant all for convenience', 'Deny unnecessary permissions or use a simpler app', 'Assume Play/App Store review caught all bad apps', 'Root the phone to help it'],
                1,
                'Permission sprawl enables stalkerware and data resale—least privilege on mobile matters.',
                'hard',
                ['Check app reputation and update history.', 'Use iOS/Android granular permissions when available.']),
            Q('What is a DPIA commonly for?',
                ['Printer ink levels', 'Assessing privacy risks of new processing', 'Disk speed tests', 'Camera focus'],
                1,
                'Organizations use DPIAs (or similar) before high-risk personal data projects.',
                'medium',
                ['Individuals benefit from the mindset: what could go wrong if this leaks?', 'Students in EU frameworks see this term often.']),
            Q('“Public” social profile still risks:',
                ['Nothing once set to friends-only photos', 'Employers, scammers, and stalkers aggregating clues', 'Only losing likes', 'Legal immunity'],
                1,
                'Metadata, friend leaks, and screenshots bypass simplistic privacy UI.',
                'medium',
                ['Periodic audits of “public preview”.', 'Separate hobby and professional personas if needed.']),
            Q('Selling your old phone safely means:',
                ['Log out, encrypt/reset, remove storage if possible', 'Just delete photos gallery', 'Keep SIM for memories', 'Only airplane mode'],
                0,
                'Factory reset + encryption + remote wipe policies reduce leftover artifacts.',
                'easy',
                ['Remove SD cards and eSIM carefully as per carrier docs.', 'Some SSD-style phones need multiple pass wipes.']),
            Q('A newsletter unsubscribe link looks strange. Better approach:',
                ['Click fast', 'Mark spam and block; use official account settings on the vendor site', 'Forward to everyone', 'Disable antivirus first'],
                1,
                'Malicious unsubscribe links exist—prefer portal settings or known-good flows.',
                'hard',
                ['List-Unsubscribe headers help legitimate mail.', 'Whois the domain if you are technical.']),
            Q('Biometric unlock on your phone helps mainly by:',
                ['Replacing the need for device encryption', 'Convenient strong local authentication tied to you', 'Guaranteeing cloud safety', 'Stopping all malware'],
                1,
                'It complements encryption; still protect lockouts, backups, and OS updates.',
                'medium',
                ['Travel: know legal differences on compelled unlock.', 'Register alternate biometrics if supported.']),
            Q('GDPR-style rights may include access and erasure, which teach individuals to:',
                ['Spam companies randomly', 'Ask what is stored and request correction/deletion where applicable', 'Avoid all online services forever', 'Share passwords with DPOs'],
                1,
                'Use official privacy portals; verification loops exist to prevent abuse.',
                'easy',
                ['Keep request copies for follow-up.', 'Local laws vary; principles still help globally.'])
        ]
    },
    browsing: {
        title: 'Safe Browsing',
        questions: [
            Q('Why prefer HTTPS sites for login pages?',
                ['HTTP is always faster', 'HTTPS encrypts traffic in transit, reducing snooping and tampering', 'HTTPS disables cookies', 'Browsers forbid HTTP'],
                1,
                'HTTPS encrypts traffic in transit, reducing tampering and snooping. Avoid submitting passwords on plain HTTP.',
                'easy',
                ['Look for the lock and correct domain.', 'Corporate TLS inspection is a special case — know your employer policy.']),
            Q('Downloading software should ideally happen from:',
                ['Third-party “free mirror” with big green buttons', 'The vendor’s official site or built-in store', 'Discord DMs from strangers', 'Auto-run email attachments'],
                1,
                'Supply-chain and fake mirrors bundle malware; verify publisher signatures when shown.',
                'medium',
                ['Compare hashes when projects publish them.', 'Read installer screens for bundled junk.']),
            Q('Browser extension risk includes:',
                ['Reading page data and exfiltrating credentials if malicious', 'Impossible—stores vet everything perfectly', 'Only changing your wallpaper', 'Disabling HTTPS'],
                0,
                'Install few extensions from trusted authors; review permissions periodically.',
                'hard',
                ['Enterprise policies can allowlists extensions.', 'Remove stale extensions after trials.']),
            Q('A site says “Your browser is outdated—click to update.” You should:',
                ['Use the official browser update channel, not this page', 'Click because it is red', 'Download an EXE from the pop-up', 'Disable updates'],
                0,
                'Fake updates push malware; trust OS/browser built-in updaters.',
                'easy',
                ['Check About dialog for channel info.', 'Restart after patching.'],
                'A tab you opened from search results flashes red warnings and insists you must install “CriticalBrowserUpdate.exe” now.'),
            Q('Password reuse across forums and banking mainly risks:',
                ['Faster typing', 'Credential stuffing if one site leaks', 'Better MFA', 'Improved SEO'],
                1,
                'Attackers try leaked pairs across many sites—uniqueness stops domino breaches.',
                'easy',
                ['Check breaches, rotate affected unique passwords.', 'Enroll in breach alerts where available.']),
            Q('Clickjacking overlays invisible buttons to trick clicks. Defenses include:',
                ['Disable X-Frame-Options / CSP (wrong)', 'Sites using frame protections; users cautious on odd transparent overlays', 'Using HTTP only', 'More toolbars'],
                1,
                'Modern sites set headers; users should distrust weird opaque overlays.',
                'medium',
                ['Some banks detect remote desktop + overlay scams now.', 'Full-screen unexpected prompts are suspicious.']),
            Q('Which improves home DNS privacy somewhat?',
                ['Using ISP default without thought', 'Encrypted DNS options you understand and trust', 'Posting your IP daily', 'Disabling router firmware updates'],
                1,
                'DNS over HTTPS/TLS can reduce passive logging; it is not a VPN replacement.',
                'hard',
                ['Enterprise often routes through internal resolvers.', 'Kids’ devices may need filtering resolvers.']),
            Q('Drive-by download risk is higher when:',
                ['JavaScript off and no plugins', 'Running outdated browser with known exploits on shady sites', 'Reading plain Wikipedia text only', 'Using latest patches and defaults'],
                1,
                'Patch promptly; hardened profiles for risky research.',
                'medium',
                ['VM snapshot-and-revert for malware analysts—not daily email.', 'Ad blockers reduce malicious ad chains.']),
            Q('Search engine ads for “your bank login” may lead to:',
                ['Only official pages because ads are perfect', 'Phishing look-alikes above organic results', 'Guaranteed refunds', 'Hardware wallets'],
                1,
                'Type domains or use bookmarks; do not trust top ad slots blindly.',
                'easy',
                ['Report malicious ads when platforms allow.', 'Use bank mobile apps from official stores.']),
            Q('Public computer best practice signing into webmail:',
                ['Stay logged in for next person', 'Use private window, log out, clear data, avoid saving passwords', 'Save password for speed', 'Disable 2FA temporarily'],
                1,
                'Assume keyboard loggers and shoulder surfers; minimize session footprint.',
                'medium',
                ['Hardware security keys help even on hostile kiosks—if supported safely.', 'Prefer your phone hotspot vs café Wi‑Fi when possible.'])
        ]
    }
};

// ——— Game state ———
let currentCategory = '';
let selectedDifficulty = 'mixed';
let quizMode = 'standard';
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;
let quizStartTime = null;
let currentQuestions = [];
let questionTimerId = null;
let questionDeadline = null;
let runCorrectCount = 0;
let timedRun = false;
let multiplayerMode = false;
let multiplayerPhase = 0;
let playerScores = [0, 0];
let playerCorrect = [0, 0];
let playerTimes = [0, 0];
let sharedQuestionList = null;
let maxPossibleScore = 0;
let multiScenarioAccumulator = 0;

const saveData = loadSave();

function loadSave() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return defaultSave();
        const o = JSON.parse(raw);
        return {
            unlocked: new Set(o.unlocked || []),
            stats: Object.assign(defaultSave().stats, o.stats || {})
        };
    } catch {
        return defaultSave();
    }
}

function defaultSave() {
    return {
        unlocked: new Set(),
        stats: {
            lifetimeCorrect: 0,
            scenarioCorrect: 0,
            categoriesCompleted: {},
            quizzesCompleted: 0
        }
    };
}

function persistSave() {
    const o = {
        unlocked: [...saveData.unlocked],
        stats: saveData.stats
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(o));
}

function getFilteredQuestions(categoryKey, difficultyMode) {
    const pool = quizData[categoryKey].questions.slice();
    let filtered;
    if (difficultyMode === 'easy') filtered = pool.filter((q) => q.difficulty === 'easy');
    else if (difficultyMode === 'medium') filtered = pool.filter((q) => q.difficulty === 'easy' || q.difficulty === 'medium');
    else if (difficultyMode === 'hard') filtered = pool.filter((q) => q.difficulty === 'medium' || q.difficulty === 'hard');
    else filtered = pool.slice();
    if (filtered.length < QUIZ_LENGTH) filtered = pool.slice();
    shuffleArray(filtered);
    return filtered.slice(0, QUIZ_LENGTH);
}

function computeMaxScore(questions) {
    return questions.reduce((s, q) => s + (DIFFICULTY_POINTS[q.difficulty] || 20), 0);
}

function pointsForQuestion(q) {
    return DIFFICULTY_POINTS[q.difficulty] || 20;
}

// ——— DOM ———
const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const handoffScreen = document.getElementById('handoff-screen');
const categoryCards = document.querySelectorAll('.category-card');
const startQuizBtn = document.getElementById('start-quiz');
const questionText = document.getElementById('question-text');
const questionOptions = document.getElementById('question-options');
const nextBtn = document.getElementById('next-btn');
const explainBtn = document.getElementById('explain-btn');
const progressFill = document.querySelector('.progress-fill');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');
const scoreSpan = document.getElementById('score');
const scoreMaxSpan = document.getElementById('score-max');
const finalScoreSpan = document.getElementById('final-score');
const scoreMessage = document.getElementById('score-message');
const correctAnswersSpan = document.getElementById('correct-answers');
const accuracySpan = document.getElementById('accuracy');
const timeTakenSpan = document.getElementById('time-taken');
const retryBtn = document.getElementById('retry-btn');
const newCategoryBtn = document.getElementById('new-category-btn');
const explanationModal = document.getElementById('explanation-modal');
const explanationContent = document.getElementById('explanation-content');
const closeExplanationBtn = document.getElementById('close-explanation-btn');
const difficultySegments = document.querySelectorAll('#difficulty-select .segment');
const modeSegments = document.querySelectorAll('#mode-select .segment');
const timerContainer = document.getElementById('timer-container');
const timerDisplay = document.getElementById('timer-display');
const playerBadge = document.getElementById('player-badge');
const scenarioPanel = document.getElementById('scenario-panel');
const scenarioText = document.getElementById('scenario-text');
const handoffContinue = document.getElementById('handoff-continue');
const multiplayerResultsEl = document.getElementById('multiplayer-results');
const versusGrid = document.getElementById('versus-grid');
const newAchievementsEl = document.getElementById('new-achievements');
const achievementsModal = document.getElementById('achievements-modal');
const achievementsList = document.getElementById('achievements-list');
const openAchievementsBtn = document.getElementById('open-achievements-btn');
const achievementsCloseBtns = document.querySelectorAll('.achievements-close');

function clearQuestionTimer() {
    if (questionTimerId) {
        clearInterval(questionTimerId);
        questionTimerId = null;
    }
    questionDeadline = null;
}

function updateTimerDisplay() {
    if (!questionDeadline) return;
    const left = Math.max(0, Math.ceil((questionDeadline - Date.now()) / 1000));
    timerDisplay.textContent = String(left);
    if (left <= 0) handleTimedOut();
}

function handleTimedOut() {
    if (selectedAnswer !== null) return;
    clearQuestionTimer();
    const question = currentQuestions[currentQuestionIndex];
    const options = questionOptions.querySelectorAll('.option');
    const answerIndex = question.correct;
    selectedAnswer = -1;
    options.forEach((opt) => {
        opt.style.pointerEvents = 'none';
    });
    if (options[answerIndex]) options[answerIndex].classList.add('correct');
    nextBtn.disabled = false;
    explainBtn.style.display = 'inline-block';
}

function startQuestionTimer() {
    clearQuestionTimer();
    if (!timedRun || quizMode !== 'timed') {
        timerContainer.classList.add('hidden');
        return;
    }
    timerContainer.classList.remove('hidden');
    questionDeadline = Date.now() + TIMED_SECONDS_PER_QUESTION * 1000;
    updateTimerDisplay();
    questionTimerId = setInterval(updateTimerDisplay, 250);
}

// ——— Welcome interactions ———
categoryCards.forEach((card) => card.addEventListener('click', () => selectCategory(card)));

difficultySegments.forEach((btn) => {
    btn.addEventListener('click', () => {
        difficultySegments.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        selectedDifficulty = btn.dataset.difficulty;
    });
});

modeSegments.forEach((btn) => {
    btn.addEventListener('click', () => {
        modeSegments.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        quizMode = btn.dataset.mode;
    });
});

startQuizBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
explainBtn.addEventListener('click', showExplanation);
retryBtn.addEventListener('click', retryQuiz);
newCategoryBtn.addEventListener('click', goToWelcome);
closeExplanationBtn.addEventListener('click', closeModal);

openAchievementsBtn.addEventListener('click', () => {
    renderAchievementsList();
    achievementsModal.style.display = 'block';
});
achievementsCloseBtns.forEach((b) =>
    b.addEventListener('click', () => {
        achievementsModal.style.display = 'none';
    })
);

handoffContinue.addEventListener('click', () => {
    multiplayerPhase = 1;
    startPlayerQuizRun(1);
});

window.addEventListener('click', (e) => {
    if (e.target === explanationModal) closeModal();
    if (e.target === achievementsModal) achievementsModal.style.display = 'none';
});

function selectCategory(card) {
    categoryCards.forEach((c) => c.classList.remove('selected'));
    card.classList.add('selected');
    currentCategory = card.dataset.category;
    startQuizBtn.disabled = false;
    startQuizBtn.textContent = `Start ${quizData[currentCategory].title} Quiz`;
}

function startQuiz() {
    if (!currentCategory) return;
    multiplayerMode = quizMode === 'multiplayer';
    multiplayerPhase = 0;
    playerScores = [0, 0];
    playerCorrect = [0, 0];
    playerTimes = [0, 0];
    multiScenarioAccumulator = 0;
    sharedQuestionList = null;
    timedRun = quizMode === 'timed';
    if (multiplayerMode) {
        sharedQuestionList = getFilteredQuestions(currentCategory, selectedDifficulty);
        maxPossibleScore = computeMaxScore(sharedQuestionList);
        startPlayerQuizRun(0);
    } else {
        beginSoloQuiz();
    }
}

function beginSoloQuiz() {
    currentQuestions = getFilteredQuestions(currentCategory, selectedDifficulty);
    maxPossibleScore = computeMaxScore(currentQuestions);
    currentQuestionIndex = 0;
    score = 0;
    runCorrectCount = 0;
    scenarioCorrectRun = 0;
    selectedAnswer = null;
    quizStartTime = Date.now();
    totalQuestionsSpan.textContent = currentQuestions.length;
    scoreSpan.textContent = score;
    scoreMaxSpan.textContent = `/ ${maxPossibleScore}`;
    playerBadge.classList.add('hidden');
    showScreen('quiz-screen');
    loadQuestion();
}

let scenarioCorrectRun = 0;

function startPlayerQuizRun(playerIndex) {
    currentQuestions = sharedQuestionList.slice();
    currentQuestionIndex = 0;
    score = 0;
    runCorrectCount = 0;
    scenarioCorrectRun = 0;
    selectedAnswer = null;
    quizStartTime = Date.now();
    totalQuestionsSpan.textContent = currentQuestions.length;
    scoreSpan.textContent = score;
    scoreMaxSpan.textContent = `/ ${maxPossibleScore}`;
    playerBadge.classList.remove('hidden');
    playerBadge.textContent = playerIndex === 0 ? 'Player 1' : 'Player 2';
    showScreen('quiz-screen');
    loadQuestion();
}

function loadQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
    progressFill.style.width = `${progress}%`;
    currentQuestionSpan.textContent = currentQuestionIndex + 1;

    if (question.scenarioSetup) {
        scenarioPanel.classList.remove('hidden');
        scenarioText.textContent = question.scenarioSetup;
    } else {
        scenarioPanel.classList.add('hidden');
        scenarioText.textContent = '';
    }

    questionText.textContent = question.question;
    questionOptions.innerHTML = '';

    question.options.forEach((option, index) => {
        const optionBtn = document.createElement('div');
        optionBtn.className = 'option';
        optionBtn.textContent = option;
        optionBtn.dataset.index = index;
        optionBtn.addEventListener('click', () => selectAnswer(index));
        questionOptions.appendChild(optionBtn);
    });

    nextBtn.disabled = true;
    explainBtn.style.display = 'none';
    selectedAnswer = null;
    startQuestionTimer();
}

function selectAnswer(answerIndex) {
    if (selectedAnswer !== null) return;

    clearQuestionTimer();
    selectedAnswer = answerIndex;
    const question = currentQuestions[currentQuestionIndex];
    const options = questionOptions.querySelectorAll('.option');
    const pts = pointsForQuestion(question);

    options[answerIndex].classList.add('selected');

    if (answerIndex === question.correct) {
        score += pts;
        runCorrectCount += 1;
        if (question.scenarioSetup) scenarioCorrectRun += 1;
        options[answerIndex].classList.add('correct');
        scoreSpan.textContent = score;
        scoreSpan.style.animation = 'scoreAppear 0.5s ease-out';
        setTimeout(() => {
            scoreSpan.style.animation = '';
        }, 500);
    } else {
        options[answerIndex].classList.add('incorrect');
        options[question.correct].classList.add('correct');
    }

    options.forEach((opt) => {
        opt.style.pointerEvents = 'none';
    });

    nextBtn.disabled = false;
    explainBtn.style.display = 'inline-block';
}

function nextQuestion() {
    currentQuestionIndex += 1;
    if (currentQuestionIndex >= currentQuestions.length) {
        showResults();
    } else {
        loadQuestion();
    }
}

function showExplanation() {
    const question = currentQuestions[currentQuestionIndex];
    const tips = (question.detailTips || [])
        .map((t) => `<li>${escapeHtml(t)}</li>`)
        .join('');
    const tipsBlock = tips ? `<h4>Go deeper</h4><ul class="explanation-tips">${tips}</ul>` : '';
    explanationContent.innerHTML = `
        <h4>Why this matters</h4>
        <p>${escapeHtml(question.explanation)}</p>
        ${tipsBlock}
    `;
    explanationModal.style.display = 'block';
}

function escapeHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
}

function closeModal() {
    explanationModal.style.display = 'none';
}

function showResults() {
    clearQuestionTimer();
    timerContainer.classList.add('hidden');

    const totalTime = Math.round((Date.now() - quizStartTime) / 1000);

    if (multiplayerMode && multiplayerPhase === 0) {
        playerScores[0] = score;
        playerCorrect[0] = runCorrectCount;
        playerTimes[0] = totalTime;
        multiScenarioAccumulator += scenarioCorrectRun;
        document.getElementById('handoff-title').textContent = 'Player 2 — your turn';
        document.getElementById('handoff-desc').textContent =
            'Same questions in the same order. Give the screen to Player 2 — no peeking.';
        showScreen('handoff-screen');
        return;
    }

    if (multiplayerMode && multiplayerPhase === 1) {
        playerScores[1] = score;
        playerCorrect[1] = runCorrectCount;
        playerTimes[1] = totalTime;
    }

    const isMultiFinal = multiplayerMode && multiplayerPhase === 1;
    const displayCorrect = isMultiFinal ? playerCorrect[1] : runCorrectCount;
    let accPct =
        currentQuestions.length > 0 ? Math.round((displayCorrect / currentQuestions.length) * 100) : 0;

    if (isMultiFinal) {
        finalScoreSpan.textContent = `${playerScores[0]} : ${playerScores[1]}`;
        document.getElementById('final-score-max').textContent = ' match points';
        const avgAcc =
            currentQuestions.length > 0
                ? Math.round(
                      ((playerCorrect[0] + playerCorrect[1]) / (2 * currentQuestions.length)) * 100
                  )
                : 0;
        accPct = avgAcc;
        correctAnswersSpan.textContent = `P1: ${playerCorrect[0]}/${currentQuestions.length} · P2: ${playerCorrect[1]}/${currentQuestions.length}`;
        timeTakenSpan.textContent = `${playerTimes[0] + playerTimes[1]}s combined`;
    } else {
        finalScoreSpan.textContent = String(score);
        document.getElementById('final-score-max').textContent = `/ ${maxPossibleScore}`;
        correctAnswersSpan.textContent = `${displayCorrect} / ${currentQuestions.length}`;
        timeTakenSpan.textContent = `${totalTime}s`;
    }
    accuracySpan.textContent = `${accPct}%`;

    document.querySelector('.score-circle').classList.toggle('dual-score', isMultiFinal);

    if (isMultiFinal) {
        multiplayerResultsEl.classList.remove('hidden');
        const [p1, p2] = playerScores;
        const winner = p1 === p2 ? 'Tie game!' : p1 > p2 ? 'Player 1 wins!' : 'Player 2 wins!';
        versusGrid.innerHTML = `
            <div class="versus-card">
                <span class="versus-label">Player 1</span>
                <span class="versus-score">${p1}</span>
                <span class="versus-sub">${playerCorrect[0]} correct</span>
            </div>
            <div class="versus-divider">VS</div>
            <div class="versus-card">
                <span class="versus-label">Player 2</span>
                <span class="versus-score">${p2}</span>
                <span class="versus-sub">${playerCorrect[1]} correct</span>
            </div>
            <p class="versus-winner">${winner}</p>
        `;
    } else {
        multiplayerResultsEl.classList.add('hidden');
        versusGrid.innerHTML = '';
    }

    let message = '';
    if (isMultiFinal) message = 'Match complete — compare scores and rematch anytime.';
    else if (accPct >= 80) message = 'Excellent! Strong cybersecurity instincts.';
    else if (accPct >= 60) message = 'Good job — keep building those habits.';
    else if (accPct >= 40) message = 'Solid start — review the explanations and try another run.';
    else message = 'Keep learning — small improvements add up fast.';
    scoreMessage.textContent = message;

    const scenarioTotal = multiplayerMode ? multiScenarioAccumulator + scenarioCorrectRun : scenarioCorrectRun;

    const unlocks = recordQuizComplete({
        accuracyPct: accPct,
        difficulty: selectedDifficulty,
        timed: timedRun,
        category: currentCategory,
        multiplayer: multiplayerMode,
        playerScores: [...playerScores],
        scenarioCorrectTotal: scenarioTotal,
        correctInRun: displayCorrect,
        isMultiFinal
    });
    renderNewAchievements(unlocks);

    showScreen('results-screen');
}

function recordQuizComplete(ctx) {
    const unlockedNow = [];
    const st = saveData.stats;
    st.quizzesCompleted += 1;

    if (!ctx.multiplayer) {
        st.lifetimeCorrect += ctx.correctInRun;
        st.scenarioCorrect = (st.scenarioCorrect || 0) + ctx.scenarioCorrectTotal;
    } else if (ctx.isMultiFinal) {
        st.lifetimeCorrect += playerCorrect[0] + playerCorrect[1];
        st.scenarioCorrect = (st.scenarioCorrect || 0) + ctx.scenarioCorrectTotal;
    }

    unlockIfNew('first_steps', st.quizzesCompleted === 1, unlockedNow);

    const perfectSolo = !ctx.multiplayer && ctx.accuracyPct === 100;
    const perfectMulti =
        ctx.multiplayer &&
        ctx.isMultiFinal &&
        playerCorrect[0] === currentQuestions.length &&
        playerCorrect[1] === currentQuestions.length;
    if (perfectSolo || perfectMulti) unlockIfNew('perfectionist', true, unlockedNow);

    if (ctx.timed && ctx.accuracyPct >= 80) unlockIfNew('speed_runner', true, unlockedNow);
    if (ctx.difficulty === 'hard') unlockIfNew('hard_boiled', true, unlockedNow);
    if (ctx.multiplayer && ctx.isMultiFinal) unlockIfNew('duelist', true, unlockedNow);
    if (ctx.multiplayer && ctx.isMultiFinal && ctx.playerScores[0] !== ctx.playerScores[1]) {
        unlockIfNew('champion', true, unlockedNow);
    }

    if (!ctx.multiplayer || ctx.isMultiFinal) {
        st.categoriesCompleted[currentCategory] = (st.categoriesCompleted[currentCategory] || 0) + 1;
    }
    const distinct = Object.keys(st.categoriesCompleted).length;
    if (distinct >= 4) unlockIfNew('explorer', true, unlockedNow);
    if (st.lifetimeCorrect >= 25) unlockIfNew('scholar', true, unlockedNow);
    if (st.scenarioCorrect >= 5) unlockIfNew('storyteller', true, unlockedNow);

    persistSave();
    return unlockedNow;
}

function unlockIfNew(id, condition, unlockedNow) {
    if (!condition) return;
    if (!saveData.unlocked.has(id)) {
        saveData.unlocked.add(id);
        unlockedNow.push(id);
    }
}

function renderNewAchievements(ids) {
    if (!ids.length) {
        newAchievementsEl.classList.add('hidden');
        newAchievementsEl.innerHTML = '';
        return;
    }
    newAchievementsEl.classList.remove('hidden');
    const defs = ids.map((id) => ACHIEVEMENTS_DEF.find((a) => a.id === id)).filter(Boolean);
    newAchievementsEl.innerHTML = `
        <h3>New achievements</h3>
        <div class="achievement-toast-list">
            ${defs
                .map(
                    (a) => `
                <div class="achievement-toast unlocked">
                    <i class="fas ${a.icon}"></i>
                    <div><strong>${escapeHtml(a.title)}</strong><br><span>${escapeHtml(a.desc)}</span></div>
                </div>`
                )
                .join('')}
        </div>
    `;
}

function renderAchievementsList() {
    achievementsList.innerHTML = ACHIEVEMENTS_DEF.map((a) => {
        const ok = saveData.unlocked.has(a.id);
        return `
            <div class="achievement-row ${ok ? 'unlocked' : 'locked'}">
                <div class="achievement-icon"><i class="fas ${a.icon}"></i></div>
                <div>
                    <strong>${escapeHtml(a.title)}</strong>
                    <p>${escapeHtml(a.desc)}</p>
                </div>
                <span class="achievement-status">${ok ? 'Unlocked' : 'Locked'}</span>
            </div>
        `;
    }).join('');
}

function retryQuiz() {
    if (multiplayerMode) {
        multiplayerPhase = 0;
        playerScores = [0, 0];
        playerCorrect = [0, 0];
        playerTimes = [0, 0];
        multiScenarioAccumulator = 0;
        sharedQuestionList = getFilteredQuestions(currentCategory, selectedDifficulty);
        maxPossibleScore = computeMaxScore(sharedQuestionList);
        startPlayerQuizRun(0);
    } else {
        beginSoloQuiz();
    }
}

function goToWelcome() {
    clearQuestionTimer();
    multiplayerMode = false;
    multiplayerPhase = 0;
    document.querySelector('.score-circle').classList.remove('dual-score');
    categoryCards.forEach((c) => c.classList.remove('selected'));
    currentCategory = '';
    startQuizBtn.disabled = true;
    startQuizBtn.textContent = 'Select a category to begin';
    newAchievementsEl.classList.add('hidden');
    newAchievementsEl.innerHTML = '';
    showScreen('welcome-screen');
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    scenarioCorrectRun = 0;
    const logo = document.querySelector('.logo');
    logo.style.opacity = '0';
    logo.style.transform = 'translateY(20px)';
    setTimeout(() => {
        logo.style.transition = 'all 0.8s ease-out';
        logo.style.opacity = '1';
        logo.style.transform = 'translateY(0)';
    }, 100);
});
