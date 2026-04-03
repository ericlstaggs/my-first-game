
# 📘 Starter `AGENTS.md`

Here is a simple version that introduces the idea without overcomplicating it.

```md
# AGENTS.md

## Purpose
This document describes the basic responsibilities of the different JavaScript files in this project.

It helps keep the project organized by making it clear which file is responsible for which task.

---

## Project Agent Overview

### 1. Page Controller Agent
**File Example:** `scripts/controllers/game-controller.js`

**Responsibility:**
- Connect the HTML page to the JavaScript modules
- Listen for button clicks
- Call the correct functions when the user interacts with the page
- Coordinate the overall page behavior

**In simple terms:**
This is the traffic director for the page.

---

### 2. Session Agent
**File Example:** `scripts/modules/game-session.js`

**Responsibility:**
- Save and retrieve session data
- Initialize default session values
- Reset stored game data when needed

**In simple terms:**
This manages the browser session data for the game.

---

### 3. Score Agent
**File Example:** `scripts/modules/score-manager.js`

**Responsibility:**
- Add new scores
- Sort scores
- Manage score-related logic

**In simple terms:**
This handles the game score system.

---

### 4. Leaderboard Agent
**File Example:** `scripts/modules/leaderboard.js`

**Responsibility:**
- Provide leaderboard data to the page
- Support score display features

**In simple terms:**
This supplies leaderboard information.

---

### 5. UI Agent
**File Example:** `scripts/modules/ui.js`

**Responsibility:**
- Update messages on the page
- Render score lists and leaderboard content
- Control what the user sees

**In simple terms:**
This handles display and rendering.

---

### 6. Utility Agent
**File Example:** `scripts/modules/utils.js`

**Responsibility:**
- Provide helper functions
- Support small reusable tasks like formatting or logging

**In simple terms:**
This contains helper tools used by other files.

---

## Basic Rule
Each file should have a clear job.

Avoid putting all code in one giant script.

Instead:

- controller handles events
- modules handle logic
- UI handles rendering
- storage/session handles saved data

---

## Why This Matters
This structure makes the project:

- easier to read
- easier to debug
- easier to grade
- easier to expand later

---

## Initial Class Goal
For now, this file is only a simple planning document.

We will expand it in class as we make our project structure more advanced.