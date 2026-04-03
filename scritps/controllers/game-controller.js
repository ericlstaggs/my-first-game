import { initializeSession, savePlayer, resetSession } from '../modules/game-session.js';
import { recordGarfieldHighScore } from '../modules/score-manager.js';
import { getLeaderboard } from '../modules/leaderboard.js';
import { renderStatus, renderLeaderboard } from '../modules/ui.js';
import { logAction } from '../modules/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  initializeSession();
  renderStatus('Session initialized. Ready.');

  const savePlayerBtn = document.querySelector('#save-player-btn');
  const recordScoreBtn = document.querySelector('#record-score-btn');
  const resetGameBtn = document.querySelector('#reset-game-btn');
  const viewLeaderboardBtn = document.querySelector('#view-leaderboard-btn');

  savePlayerBtn.addEventListener('click', () => {
    savePlayer();
    logAction('Saved player Garfield');
    renderStatus('Player saved as Garfield.');
  });

  recordScoreBtn.addEventListener('click', () => {
    const result = recordGarfieldHighScore();
    logAction('Record high score button clicked');
    renderStatus(result.message);
  });

  resetGameBtn.addEventListener('click', () => {
    resetSession();
    logAction('Game reset');
    renderStatus('Game session reset.');
    renderLeaderboard([]);
  });

  viewLeaderboardBtn.addEventListener('click', () => {
    const scores = getLeaderboard();
    logAction('Viewed leaderboard');
    renderLeaderboard(scores);
    renderStatus('Leaderboard displayed.');
  });
});