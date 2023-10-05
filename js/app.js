// Variables globales
let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
const message = document.querySelector("#message");
const scorePlayer1 = document.querySelector("#jugador1");
const scorePlayer2 = document.querySelector("#jugador2");

// Clase para los jugadores
class player {
  constructor(name, score) {
    this.name = name;
    this.score = score;
  }
}

// Inicio los jugadores
let player1 = new player("rodri", 0);
let player2 = new player("lauti", 0);

// Posibles combinaciones para ganar
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Funcion para saber quien es el currentplayer
function whoIs(currentPlayer) {
  if (currentPlayer === "X") {
    return player1;
  } else {
    return player2;
  }
}

// Funcion para realizar un movimiento
function makeMove(cellIndex) {
  if (gameBoard[cellIndex] === "" && gameActive) {
    gameBoard[cellIndex] = currentPlayer;
    cells[cellIndex].innerText = currentPlayer;

    if (checkWin()) {
      message.innerText = `${whoIs(currentPlayer).name} ha ganado!`;
      whoIs(currentPlayer).score++;
      gameActive = false;
      scoreboard();
      // Si ya no hay celdas vacias, se declara empate
    } else if (!gameBoard.includes("")) {
      message.innerText = "Empate!";
      gameActive = false;
    } else {
      // Si nadie gana, el turno cambia
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      message.innerText = `Turno de ${whoIs(currentPlayer).name}`;
    }
  }
}

// Funcion para verificar si hay un ganador
function checkWin() {
  // Comparo las posiciones de las celdas elegidas con los posibles arrays ganadores
  for (const array of winningCombinations) {
    const [a, b, c] = array;
    const equals =
      gameBoard[a] === gameBoard[b] && gameBoard[b] === gameBoard[c]
        ? true
        : false;
    // Aparte de revisar que las 3 celdas tengan el mismo contenido, pregunto si no estan vacias
    if (gameBoard[a] && equals) {
      return true;
    }
  }
  return false;
}

// Funcion para reiniciar el juego
function resetBoard() {
  currentPlayer = "X";
  gameBoard = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  message.innerText = "";
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
  }
  message.innerText = `Turno de ${whoIs(currentPlayer).name}`;
}

// Obtengo todas las celdas
const cells = document.querySelectorAll(".cell");

// Inicio de evento
for (let i = 0; i < cells.length; i++) {
  cells[i].addEventListener("click", () => {
    makeMove(i);
  });
}

// Boton de reinicio
const resetButton = document.querySelector("#btnReset");
resetButton.addEventListener("click", resetBoard);

// Inicio
message.innerText = `Turno de ${whoIs(currentPlayer).name}`;

// Modifico el scoreboard
function scoreboard() {
  scorePlayer1.innerText = `${player1.name}: ${player1.score}`;
  scorePlayer2.innerText = `${player2.name}: ${player2.score}`;
}
