import { DEFAULT_PLAYER_NAME, DEFAULT_LEADERBOARD } from '../config/defaults.js';

// console.log('in modules/game-session');

const PLAYER_KEY = 'playerName';
const LEADERBOARD_KEY = 'leaderboard';

export function initializeSession() {
  if (!sessionStorage.getItem(PLAYER_KEY)) {
    sessionStorage.setItem(PLAYER_KEY, '');
  }

  if (!sessionStorage.getItem(LEADERBOARD_KEY)) {
    sessionStorage.setItem(LEADERBOARD_KEY, JSON.stringify(DEFAULT_LEADERBOARD));
  }
}

export function savePlayer() {
  sessionStorage.setItem(PLAYER_KEY, DEFAULT_PLAYER_NAME);
}

export function getPlayer() {
  return sessionStorage.getItem(PLAYER_KEY);
}

export function getLeaderboardData() {
  return JSON.parse(sessionStorage.getItem(LEADERBOARD_KEY)) || [];
}

export function setLeaderboardData(data) {
  sessionStorage.setItem(LEADERBOARD_KEY, JSON.stringify(data));
}

export function resetSession() {
  sessionStorage.removeItem(PLAYER_KEY);
  sessionStorage.removeItem(LEADERBOARD_KEY);
  initializeSession();
}