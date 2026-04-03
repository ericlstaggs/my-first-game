import { GARFIELD_NEW_SCORE } from '../config/defaults.js';
import { getPlayer, getLeaderboardData, setLeaderboardData } from '../modules/game-session.js';

export function recordGarfieldHighScore() {
  const player = getPlayer();

  if (!player) {
    return {
      success: false,
      message: 'No player saved yet. Please save Garfield first.'
    };
  }

  const leaderboard = getLeaderboardData();

  leaderboard.push({
    name: player,
    score: GARFIELD_NEW_SCORE
  });

  leaderboard.sort((a, b) => b.score - a.score);

  setLeaderboardData(leaderboard);

  return {
    success: true,
    message: `${player}'s score of ${GARFIELD_NEW_SCORE} has been recorded.`
  };
}