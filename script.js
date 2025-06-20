// === Global state ===
let players = [];
let playerScores = {}; // { playerName: totalPoints }
let currentGameNumber = 0;
let gameResults = []; // array of per-game score objects

// Rematch tracking
let rematchGamesToPlay = 0;
let rematchGamesPlayed = 0;
let inRematchSeries = false;

// DOM elements (adjust selectors to match your HTML)
const startGameBtn = document.getElementById('startGameBtn');
const endGameBtn = document.getElementById('endGameBtn');
const rematchContainer = document.getElementById('rematchContainer');
const rematchCountInput = document.getElementById('rematchCount');
const startRematchBtn = document.getElementById('startRematchBtn');
const gameCountDisplay = document.getElementById('gameCount');
const resultsContainer = document.getElementById('resultsContainer');
const playerInputsContainer = document.getElementById('playerInputs');

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
  // Setup UI for score inputs per player here...
}

// Call this to start a new game (show score inputs, reset inputs)
function startNewGame() {
  currentGameNumber++;
  updateGameCountDisplay();
  resultsContainer.innerHTML = '';
  // Show inputs for each player to enter their place (1st, 2nd, 3rd...)
  // You can clear/reset the input fields here
  hideRematchInput();
}

<div class="controls">
  <button id="toggleHistoryBtn">📜 View Game History</button>
</div>

<div id="gameHistoryContainer" style="display: none; margin-top: 1rem;"></div>

// Call this when the current game ends to save scores and continue flow
function endGame() {
  // Example: collect scores from inputs
  // Scores: 1 point for 1st place, 2 points for 2nd, etc.

  const currentScores = {};
  // Example: You must adapt this to your UI inputs to get place for each player
  players.forEach(player => {
    const placeInput = document.getElementById(`place-${player}`); // e.g. <input id="place-Alice">
    const place = parseInt(placeInput?.value);
    if (!place || place < 1) {
      alert(`Please enter a valid place for ${player}`);
      return;
    }
    currentScores[player] = place;
  });

  // Save this game's scores
  gameResults.push(currentScores);

  // Update total player scores
  players.forEach(player => {
    playerScores[player] += currentScores[player];
  });

  // Show current game results & overall scores
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
  // Sort players by total score ascending (lowest wins)
  const sorted = players.slice().sort((a, b) => playerScores[a] - playerScores[b]);
  sorted.forEach(player => {
    html += `<li>${player}: ${playerScores[player]} point${playerScores[player] !== 1 ? 's' : ''}</li>`;
  });
  html += '</ul>';
  resultsContainer.innerHTML += html;
}

function finalizeMatch() {
  // Show final overall winner and rankings
  displayOverallScores();
  roastLoser();
  alert('Match series ended! Check the final results.');
}

function roastLoser() {
  // Find player with highest score (loser)
  const sorted = players.slice().sort((a, b) => playerScores[a] - playerScores[b]);
  const loser = sorted[sorted.length - 1];

  // Call your roast function / AI API here for the loser
  console.log(`Roasting loser: ${loser}`);
  // For example: generateRoast(loser);
}

// Rematch input helpers
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

// Hook up rematch start button
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

// Example: start game button hookup (you must create a way to input player names)
startGameBtn.addEventListener('click', () => {
  // Example: get player names from inputs
  const names = [];
  players.forEach(player => {
    // replace with your actual UI code to get names
  });
  // or hardcode for test:
  initializePlayers(['Alice', 'Bob', 'Charlie', 'Diana']);
  startNewGame();
});

const toggleHistoryBtn = document.getElementById('toggleHistoryBtn');
const gameHistoryContainer = document.getElementById('gameHistoryContainer');

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


// Example: end game button hookup
endGameBtn.addEventListener('click', () => {
  endGame();
});
