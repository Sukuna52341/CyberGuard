# CyberGuard Quiz - Cybersecurity Awareness Game

An interactive cybersecurity awareness quiz that covers phishing, passwords, threats, social engineering, privacy, and safe browsing. It supports difficulty levels, timed rounds, local two-player mode, achievements, and scenario-based questions.

## Features

### Quiz categories

- **Phishing Defense**: Spot fake emails, spoofing, and urgent-request scams.
- **Password Power**: Passphrases, managers, MFA, and breach response.
- **Cyber Threats**: Malware, ransomware, botnets, and related risks.
- **Social Engineering**: Vishing, tailgating, USB drops, and pretexting.
- **Privacy & Data**: Cookies, minimization, mobile permissions, and data rights.
- **Safe Browsing**: HTTPS, extensions, fake updates, and risky downloads.

Each category has a pool of questions; each run uses **five** questions sampled from the pool (after difficulty filtering).

### Difficulty and scoring

- **Mixed**, **Easy**, **Medium**, or **Hard** filter which questions can appear.
- Points per question depend on difficulty tier (**15 / 20 / 25**), so the possible maximum score updates with the drawn set.

### Modes

- **Standard**: Answer at your own pace; optional **Explain answer** after each question (summary plus deeper tips).
- **Timed**: **30 seconds** per question; when time expires, the correct answer is revealed and the question counts as incorrect for scoring.
- **2-Player** (same device): Both players get the **same five questions in the same order**; a handoff screen appears between turns; results show a head-to-head summary.

### Interactive scenarios

Many items open with a short **Scenario** block (a realistic situation) before the multiple-choice stem.

### Achievements

Nine achievements track milestones (first quiz, perfect accuracy, timed performance, hard mode, two-player wins, breadth across categories, lifetime correct answers, scenario performance). Progress is saved in the browser via **`localStorage`** (`cyberguard_save_v1`). Open **Achievements** on the welcome screen to see locked and unlocked badges.

### UI

- Responsive layout, progress bar, score display, and results breakdown (accuracy, time, correct count).
- Optional **Google Fonts (Inter)** and **Font Awesome** icons (loaded from CDN).

## How to use

1. Open **`index.html`** in a modern desktop or mobile browser.
2. Choose **Difficulty** and **Mode** (Standard, Timed, or 2-Player).
3. Pick a **category**, then start the quiz.
4. Select an answer; use **Explain answer** for the narrative and extra bullet tips.
5. Review results; use **Try again** or **New category** as needed. In 2-Player mode, pass the device at the handoff screen.

## File structure

```
CyberGuard/
├── index.html      # Screens, modals, layout
├── styles.css      # Layout, components, responsive rules
├── script.js       # Quiz data, game rules, persistence
└── README.md       # This file
```

## Educational value (by topic)

### Phishing Defense

- Identify suspicious email patterns and spoofed senders.
- Verify requests through trusted channels.
- Report and recover from mis-clicks safely.

### Password Power

- Prefer long, unique secrets and password managers.
- Use MFA and sound rotation when accounts may be compromised.

### Cyber Threats

- Recognize ransomware, scams, and unsafe file handling.
- Understand broader concepts like botnets and supply-chain risk at a high level.

### Social Engineering

- Resist pressure tactics on phone, email, and in person.
- Treat physical and digital “bait” (e.g., unknown USB drives) with suspicion.

### Privacy & Data

- Share less, question permissions, and dispose of devices carefully.
- Understand basics of rights and requests where applicable.

### Safe Browsing

- Prefer encrypted connections and official download sources.
- Treat aggressive update prompts and sketchy extensions with skepticism.

## Privacy and security (app behavior)

- **Client-side only**: No server or analytics are required to run the game.
- **Achievements and stats** stay in your browser storage unless you clear site data.
- Content is for **education**, not a substitute for organizational policy or professional advice.

## Design and technical notes

- **Stack**: HTML, CSS, and vanilla JavaScript.
- **Optional CDN**: Fonts and icon pack (see `index.html`); the core game runs without a build step.
- **Compatibility**: Modern browsers with JavaScript enabled.

## Learning objectives

After using the quiz, learners should be better able to:

- Spot common phishing and social-engineering patterns.
- Make stronger authentication choices.
- Name major cyber threats and safer reactions.
- Apply privacy- and browsing-related habits in everyday use.

## Getting started

1. Clone or copy the project folder.
2. Open **`index.html`** in a browser (double-click or serve locally).
3. No install or compile step is required.

## Target audience

- Students and self-learners exploring security basics.
- Employees in informal awareness sessions.
- Educators needing a zero-backend classroom demo.

## Possible next steps (ideas)

Ideas for future versions—not required to enjoy the current build—might include: spoken narration, question editor, themes, or exportable quiz reports for trainers.

---

**Stay safe, stay secure.**

CyberGuard is meant to make security awareness approachable. Awareness helps, but pairing it with good tools, policies, and healthy skepticism is what protects you in the real world.
