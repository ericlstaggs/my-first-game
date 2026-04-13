const symbolsPool = ['🍎','🚀','🌟','⚽','🎵','🔥','🐱','🍩','🍓','🍀','🍉','🍋','🐶','🐼','🦄','🌈','💎','🎲','🎯','🚗','🏀','🌙','☀️','🍪','🍰','🧩','🎮','📚','✈️','🛸','🏝️','🌋','🦊','🐸','🐵','🐼','🌻','🌵','🍇','🍒','🧸'];

const difficulties = {
    easy: { cols: 4, rows: 4 },   // 16 cards -> 8 pairs
    medium: { cols: 4, rows: 6 }, // 24 cards -> 12 pairs
    hard: { cols: 6, rows: 6 }    // 36 cards -> 18 pairs
};

let currentPairs = 8; // updated when board is created

const gameBoard = document.getElementById('gameBoard');
const movesDisplay = document.getElementById('moves');
const matchesDisplay = document.getElementById('matches');
const timerDisplay = document.getElementById('timer');
const messageDisplay = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matches = 0;
let timer = 0;
let timeElapsed = null;
let gameStarted = false;
let audioCtx = null;

function playFlipSound() {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.14);
    } catch (e) {
        // fail silently if audio is not available
        console.warn('Audio not available', e);
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startTimer() {
    if (timeElapsed) return;
    timeElapsed = setInterval(() => {
        timer++;
        timerDisplay.textContent = timer;
    }, 1000);
}

function createBoard() {
    // determine difficulty and board dimensions
    const sel = document.getElementById('difficultySelect');
    const key = sel ? sel.value : 'easy';
    const settings = difficulties[key] || difficulties.easy;
    const cols = settings.cols;
    const rows = settings.rows;
    const totalCards = cols * rows;
    const pairs = Math.floor(totalCards / 2);
    currentPairs = pairs;

    // set CSS vars so grid uses correct number of columns and card width for difficulty
    gameBoard.style.setProperty('--cols', cols);
    const cardWidths = { easy: '120px', medium: '100px', hard: '88px' };
    gameBoard.style.setProperty('--cardWidth', cardWidths[key] || '120px');

    // pick `pairs` unique symbols from the pool
    const chosen = shuffle([...symbolsPool]).slice(0, pairs);
    const cardValues = shuffle([...chosen, ...chosen]);
    gameBoard.innerHTML = '';

    cardValues.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.symbol = symbol;
        card.dataset.index = index;

        card.innerHTML = `
            <div class="memory-card-inner">
                <div class="memory-face memory-back">${symbol}</div>
                <div class="memory-face memory-front">?</div>
            </div>
        `;

        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

/* ---------- Simple local auth + high score (localStorage) ---------- */
const USERS_KEY = 'mm_users_v1';
const CURRENT_KEY = 'mm_currentUser_v1';
let currentUser = null;

async function hashPassword(password) {
    const enc = new TextEncoder();
    const data = enc.encode(password);
    const hashBuf = await crypto.subtle.digest('SHA-256', data);
    const hashArr = Array.from(new Uint8Array(hashBuf));
    return hashArr.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
}

function saveUsers(u) {
    localStorage.setItem(USERS_KEY, JSON.stringify(u));
}

function setCurrentUser(name) {
    currentUser = name;
    if (name) localStorage.setItem(CURRENT_KEY, name);
    else localStorage.removeItem(CURRENT_KEY);
    refreshUserUI();
}

function refreshUserUI() {
    const userDisplay = document.getElementById('userDisplay');
    const highScoreDisplay = document.getElementById('highScoreDisplay');
    const logoutBtn = document.getElementById('logoutBtn');
    if (!userDisplay || !highScoreDisplay || !logoutBtn) return;

    if (currentUser) {
        userDisplay.textContent = currentUser;
        logoutBtn.classList.remove('d-none');
        const users = getUsers();
        const info = users[currentUser];
        if (info && info.highScore) {
            highScoreDisplay.textContent = `${info.highScore.moves} moves · ${info.highScore.time}s`;
        } else {
            highScoreDisplay.textContent = '—';
        }
        document.getElementById('loginOverlay').style.display = 'none';
    } else {
        userDisplay.textContent = 'Guest';
        highScoreDisplay.textContent = '—';
        logoutBtn.classList.add('d-none');
        document.getElementById('loginOverlay').style.display = 'flex';
    }
}

async function registerUser(username, password) {
    if (!username || !password) throw new Error('missing');
    const users = getUsers();
    if (users[username]) throw new Error('exists');
    const hash = await hashPassword(password);
    users[username] = { hash, highScore: null };
    saveUsers(users);
    setCurrentUser(username);
}

async function loginUser(username, password) {
    const users = getUsers();
    const info = users[username];
    if (!info) throw new Error('no-user');
    const hash = await hashPassword(password);
    if (hash !== info.hash) throw new Error('bad-pass');
    setCurrentUser(username);
}

function logoutUser() {
    setCurrentUser(null);
}

function updateHighScoreIfBetter(movesVal, timeVal) {
    if (!currentUser) return;
    const users = getUsers();
    const info = users[currentUser] || { hash: null, highScore: null };
    const hs = info.highScore;
    let better = false;
    if (!hs) better = true;
    else if (movesVal < hs.moves) better = true;
    else if (movesVal === hs.moves && timeVal < hs.time) better = true;

    if (better) {
        info.highScore = { moves: movesVal, time: timeVal };
        users[currentUser] = info;
        saveUsers(users);
        refreshUserUI();
        return true;
    }
    return false;
}

// wire up auth UI
document.addEventListener('DOMContentLoaded', () => {
    const stored = localStorage.getItem(CURRENT_KEY);
    if (stored) currentUser = stored;
    refreshUserUI();

    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    loginBtn && loginBtn.addEventListener('click', async () => {
        const u = document.getElementById('usernameInput').value.trim();
        const p = document.getElementById('passwordInput').value;
        try {
            await loginUser(u, p);
            refreshUserUI();
        } catch (e) {
            alert('Login failed: ' + e.message);
        }
    });

    registerBtn && registerBtn.addEventListener('click', async () => {
        const u = document.getElementById('usernameInput').value.trim();
        const p = document.getElementById('passwordInput').value;
        try {
            await registerUser(u, p);
            refreshUserUI();
        } catch (e) {
            alert('Register failed: ' + e.message);
        }
    });

    logoutBtn && logoutBtn.addEventListener('click', () => {
        logoutUser();
    });
    // difficulty selector - restart when user changes
    const diff = document.getElementById('difficultySelect');
    if (diff) diff.addEventListener('change', () => {
        restartGame();
    });
});

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    if (this.classList.contains('matched')) return;

    if (!gameStarted) {
        gameStarted = true;
        startTimer();
    }

    this.classList.add('flipped');

    playFlipSound();

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    moves++;
    movesDisplay.textContent = moves;

    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;
    if (isMatch) {
        handleMatch();
    } else {
        unflipCards();
    }
}

function handleMatch() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matches++;
    matchesDisplay.textContent = matches;
    resetTurn();
    checkWin();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetTurn();
    }, 900);
}

function resetTurn() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function checkWin() {
    if (matches === currentPairs) {
        clearInterval(timeElapsed);
        timeElapsed = null;
        messageDisplay.textContent = `Congratulations! You won in ${moves} moves and ${timer} seconds!`;
        // update high score for logged in user
        const improved = updateHighScoreIfBetter(moves, timer);
        if (currentUser) {
            if (improved) messageDisplay.textContent += ' New personal best!';
            else messageDisplay.textContent += '';
        }
    }
}

function restartGame() {
    clearInterval(timeElapsed);
    timeElapsed = null;
    timer = 0;
    moves = 0;
    matches = 0;
    gameStarted = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;

    movesDisplay.textContent = moves;
    matchesDisplay.textContent = matches;
    timerDisplay.textContent = timer;
    messageDisplay.textContent = '';

    createBoard();
}

restartBtn.addEventListener('click', restartGame);
createBoard();
