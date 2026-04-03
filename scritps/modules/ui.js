export function renderStatus(message) {
  const status = document.querySelector('#status-message');
  status.textContent = message;
}

export function renderLeaderboard(scores) {
  const list = document.querySelector('#leaderboard-list');

  if (!scores.length) {
    list.innerHTML = '<li>No scores available.</li>';
    return;
  }

  list.innerHTML = scores
    .map(entry => `<li>${entry.name} — ${entry.score}</li>`)
    .join('');
}