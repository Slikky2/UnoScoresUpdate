
// === Global state ===
let players = [];
let playerScores = {};
let currentGameNumber = 0;
let gameResults = [];

let rematchGamesToPlay = 0;
let rematchGamesPlayed = 0;
let inRematchSeries = false;

const startGameBtn = document.getElementById('startGameBtn');
const endGameBtn = document.getElementById('endGameBtn');
const rematchContainer = document.getElementById('rematchContainer');
const rematchCountInput = document.getElementById('rematchCount');
const startRematchBtn = document.getElementById('startRematchBtn');
const gameCountDisplay = document.getElementById('gameCount');
const resultsContainer = document.getElementById('resultsContainer');
const playerInputsContainer = document.getElementById('playerInputs');
const toggleHistoryBtn = document.getElementById('toggleHistoryBtn');
const gameHistoryContainer = document.getElementById('gameHistoryContainer');

// Initialize players and UI
function initializePlayers(names) {
  players = names;
  playerScores = {};
  players.forEach(p => (playerScores[p] = 0));
  currentGameNumber = 0;
  gameResults = [];
  inRematchSeries = false;
  rematchGamesPlayed = 0;
  rematchGamesToPlay = 0;
  updateGameCountDisplay();
  hideRematchInput();
  resultsContainer.innerHTML = '';
  playerInputsContainer.innerHTML = '';
  players.forEach(player => {
    const label = document.createElement('label');
    label.textContent = `${player}'s Place (1, 2, 3...)`;
    const input = document.createElement('input');
    input.type = 'number';
    input.id = `place-${player}`;
    input.min = 1;
    input.placeholder = `Enter place for ${player}`;
    playerInputsContainer.appendChild(label);
    playerInputsContainer.appendChild(input);
  });
}

function startNewGame() {
  currentGameNumber++;
  updateGameCountDisplay();
  resultsContainer.innerHTML = '';
  hideRematchInput();
  players.forEach(player => {
    const input = document.getElementById(`place-${player}`);
    if (input) input.value = '';
  });
}

function endGame() {
  const currentScores = {};
  let valid = true;
  players.forEach(player => {
    const placeInput = document.getElementById(`place-${player}`);
    const place = parseInt(placeInput?.value);
    if (!place || place < 1) {
      alert(`Please enter a valid place for ${player}`);
      valid = false;
    }
    currentScores[player] = place;
  });

  if (!valid) return;

  gameResults.push(currentScores);
  players.forEach(player => {
    playerScores[player] += currentScores[player];
  });

  displayGameResults(currentScores);
  displayOverallScores();

  if (inRematchSeries) {
    rematchGamesPlayed++;
    if (rematchGamesPlayed >= rematchGamesToPlay) {
      inRematchSeries = false;
      finalizeMatch();
      hideRematchInput();
    } else {
      startNewGame();
    }
  } else {
    showRematchInput();
  }
}

function displayGameResults(gameScoreObj) {
  let html = `<h3>Game ${currentGameNumber} Results</h3><ul>`;
  Object.entries(gameScoreObj).forEach(([player, score]) => {
    html += `<li>${player}: ${score} point${score > 1 ? 's' : ''}</li>`;
  });
  html += '</ul>';
  resultsContainer.innerHTML = html;
}

function displayOverallScores() {
  let html = '<h3>Overall Scores</h3><ul>';
  const sorted = players.slice().sort((a, b) => playerScores[a] - playerScores[b]);
  sorted.forEach(player => {
    html += `<li>${player}: ${playerScores[player]} point${playerScores[player] !== 1 ? 's' : ''}</li>`;
  });
  html += '</ul>';
  resultsContainer.innerHTML += html;
}

function finalizeMatch() {
  displayOverallScores();
  roastLoser();
  alert('Match series ended! Check the final results.');
}

function roastLoser() {
  const sorted = players.slice().sort((a, b) => playerScores[a] - playerScores[b]);
  const loser = sorted[sorted.length - 1];
  console.log(`Roasting loser: ${loser}`);
  // Add call to generateRoast(loser) if using AI
}

function showRematchInput() {
  rematchContainer.style.display = 'block';
}

function hideRematchInput() {
  rematchContainer.style.display = 'none';
}

function updateGameCountDisplay() {
  if (gameCountDisplay) {
    gameCountDisplay.textContent = `Game ${currentGameNumber}`;
  }
}

startRematchBtn.addEventListener('click', () => {
  const count = parseInt(rematchCountInput.value);
  if (!count || count < 1) {
    alert('Please enter a valid number of rematch games.');
    return;
  }
  rematchGamesToPlay = count;
  rematchGamesPlayed = 0;
  inRematchSeries = true;
  hideRematchInput();
  startNewGame();
});

startGameBtn.addEventListener('click', () => {
  const names = prompt("Enter player names separated by commas").split(',').map(n => n.trim()).filter(Boolean);
  if (names.length < 2) {
    alert("Please enter at least two names.");
    return;
  }
  initializePlayers(names);
  startNewGame();
});

endGameBtn.addEventListener('click', () => {
  endGame();
});

toggleHistoryBtn.addEventListener('click', () => {
  if (gameHistoryContainer.style.display === 'none') {
    showGameHistory();
    gameHistoryContainer.style.display = 'block';
    toggleHistoryBtn.textContent = '❌ Hide Game History';
  } else {
    gameHistoryContainer.style.display = 'none';
    toggleHistoryBtn.textContent = '📜 View Game History';
  }
});

function showGameHistory() {
  if (!gameResults.length) {
    gameHistoryContainer.innerHTML = '<p>No games played yet.</p>';
    return;
  }

  let html = `<h3>📘 Game History</h3>`;
  gameResults.forEach((scoreObj, index) => {
    html += `<div style="margin-bottom: 1rem;"><strong>Game ${index + 1}</strong><ul>`;
    Object.entries(scoreObj).forEach(([player, score]) => {
      html += `<li>${player}: ${score} point${score !== 1 ? 's' : ''}</li>`;
    });
    html += `</ul></div>`;
  });

  gameHistoryContainer.innerHTML = html;
}
