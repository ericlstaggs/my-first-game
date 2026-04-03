# 🎮 Front-End JS Modules for the Web Game Project (CIS 376)

> refer to the [wiki/js modules](https://github.com/barrycumbie/game-score/wiki/js-modules)

## 🧭 BLUF
For this lab, let's figure out modules & game socring 

- Save hardcoded player name: **Garfield**
- Record Garfield’s high score
- Reset game
- View leaderboard / high scores

These actions should update and display data using **session storage** and clean **front-end JS modules**.

---

## 🎯 Goal
Your job is to organize your code like a small real-world app:

- HTML provides the buttons and display areas
- A page **controller** wires up DOM events
- Reusable **modules** handle storage, scores, rendering, and game state

---

## 🧱 Recommended Structure

```text
.
├── index.html
├── scripts/
│   ├── controllers/
│   │   └── game-controller.js
│   │
│   ├── modules/
│   │   ├── game-session.js
│   │   ├── score-manager.js
│   │   ├── leaderboard.js
│   │   ├── ui.js
│   │   └── utils.js
│   │
│   └── config/
│       └── defaults.js
│
├── styles/
├── assets/
└── docs/

```

# js module architecture

`HTML → Controller → Modules`


- HTML
  - Contains buttons and areas for output
- Controller
  - Listens for button clicks and coordinates actions
- Modules
  - Contain reusable logic (non-dom specific f/n)
  - saving session data
  - updating score data
  - rendering leaderboard
  - resetting game state