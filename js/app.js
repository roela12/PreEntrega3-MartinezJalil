// Variables globales
let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
const message = document.querySelector("#message");
const scorePlayer1 = document.querySelector("#jugador1");
const scorePlayer2 = document.querySelector("#jugador2");
const namePlayer1 = document.querySelector("#nombre1");
const namePlayer2 = document.querySelector("#nombre2");
const divInfoPokemon = document.querySelector("#infoPokemon");
const inputPokemon1 = document.querySelector("#pokemon1");
const inputPokemon2 = document.querySelector("#pokemon2");

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

// Clase para los jugadores
class player {
  constructor(id, name, score, pokemon) {
    this.id = id;
    this.name = name;
    this.score = score;
    this.pokemon = pokemon;
  }
}

// Traigo los jugadores del storage
const player1Storage = JSON.parse(localStorage.getItem("1"));
const player2Storage = JSON.parse(localStorage.getItem("2"));

// Inicio los jugadores
let player1 = player1Storage || new player("X", "Jugador 1", 0, "");
let player2 = player2Storage || new player("O", "Jugador 2", 0, "");

// Funcion para cargar los pokemones
function loadBothPokemons() {
  const pokemon1 = inputPokemon1.value;
  const pokemon2 = inputPokemon2.value;
  divInfoPokemon.innerHTML = `
    <img width="20%" src="https://i.gifer.com/LCPT.gif" alt="Cargando">
    <p>Revisar los nombres de los pokemon!</p>`;
  cargarPokemon(pokemon1, pokemon2);
}

async function cargarPokemon(pokemon1, pokemon2) {
  const respuesta1 = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemon1}/`
  );
  const respuesta2 = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemon2}/`
  );
  const infoPokemon1 = await respuesta1.json();
  const infoPokemon2 = await respuesta2.json();
  player1.pokemon = infoPokemon1.sprites.other.dream_world.front_default;
  player2.pokemon = infoPokemon2.sprites.other.dream_world.front_default;
  localStorage.setItem("1", JSON.stringify(player1));
  localStorage.setItem("2", JSON.stringify(player2));
  divInfoPokemon.innerHTML = `
    <div class="pokemon">
      <h2>${player1.name}:</h2>
      <img src="${infoPokemon1.sprites.other.dream_world.front_default}" alt="${infoPokemon1.name}"/>
    </div>
    <div class="pokemon">
      <h2>${player2.name}:</h2>
      <img src="${infoPokemon2.sprites.other.dream_world.front_default}" alt="${infoPokemon2.name}"/>
    </div>
      `;
}

// Cargo los pokemones con boton
const loadPokemons = document.querySelector("#loadPokemons");
loadPokemons.addEventListener("click", loadBothPokemons);

// Funcion para modificar el scoreboard
function scoreboard() {
  scorePlayer1.innerText = `${player1.name}: ${player1.score}`;
  scorePlayer2.innerText = `${player2.name}: ${player2.score}`;
}

// Funcion para saber quien es el currentplayer
function whoIs(currentPlayer) {
  if (currentPlayer === "X") {
    return player1;
  } else {
    return player2;
  }
}

// Funcion para imprimir los pokemons
function printPokemon() {
  divInfoPokemon.innerHTML = `
    <div class="pokemon">
      <h2>${player1.name}:</h2>
      <img src="${player1.pokemon}" alt="Pokemon de ${player1.name}"/>
    </div>
    <div class="pokemon">
      <h2>${player2.name}:</h2>
      <img src="${player2.pokemon}" alt="Pokemon de ${player2.name}"/>
    </div>
      `;
}

// Funcion para cargar los nombres
function loadBothNames() {
  player1.name = namePlayer1.value || "Jugador 1";
  player2.name = namePlayer2.value || "Jugador 2";
  localStorage.setItem("1", JSON.stringify(player1));
  localStorage.setItem("2", JSON.stringify(player2));
  scoreboard();
  message.innerText = `Turno de ${whoIs(currentPlayer).name}`;
  if (player1.pokemon) {
    printPokemon();
  }
}

// Cargo los nombres con boton
const loadNames = document.querySelector("#loadNames");
loadNames.addEventListener("click", loadBothNames);

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

// Funcion para realizar un movimiento
function makeMove(cellIndex) {
  if (gameBoard[cellIndex] === "" && gameActive) {
    gameBoard[cellIndex] = currentPlayer;
    if (player1.pokemon) {
      cells[cellIndex].innerHTML = `
        <img src="${whoIs(currentPlayer).pokemon}" alt="${
        whoIs(currentPlayer).id
      }"/>`;
    } else {
      cells[cellIndex].innerText = currentPlayer;
    }

    if (checkWin()) {
      message.innerText = `${whoIs(currentPlayer).name} ha ganado!`;
      Swal.fire({
        title: `${whoIs(currentPlayer).name} ha ganado!`,
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "green",
      });
      whoIs(currentPlayer).score++;
      localStorage.setItem("1", JSON.stringify(player1));
      localStorage.setItem("2", JSON.stringify(player2));
      gameActive = false;
      scoreboard();
      // Si ya no hay celdas vacias, se declara empate
    } else if (!gameBoard.includes("")) {
      message.innerText = "Empate!";
      Swal.fire({
        title: "Empate!",
        icon: "info",
        confirmButtonText: "Ok",
        confirmButtonColor: "blue",
      });
      gameActive = false;
    } else {
      // Si nadie gana, el turno cambia
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      message.innerText = `Turno de ${whoIs(currentPlayer).name}`;
    }
  }
}

// Funcion para reiniciar el juego
function resetBoard() {
  gameBoard = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  message.innerText = "";
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
  }
  message.innerText = `Turno de ${whoIs(currentPlayer).name}`;
}

//funcion para resetear el score
function resetScore() {
  player1 = new player("X", "Jugador 1", 0, "");
  player2 = new player("O", "Jugador 2", 0, "");
  localStorage.clear();
  scoreboard();
  message.innerText = `Turno de ${whoIs(currentPlayer).name}`;
  divInfoPokemon.innerHTML = "";
}

// Obtengo todas las celdas
const cells = document.querySelectorAll(".cell");

// Inicio
message.innerText = `Turno de ${whoIs(currentPlayer).name}`;
if (player1.pokemon) {
  printPokemon();
}

// Inicio de evento
scoreboard();
for (let i = 0; i < cells.length; i++) {
  cells[i].addEventListener("click", () => {
    makeMove(i);
  });
}

// Boton de reinicio
const resetButton = document.querySelector("#btnReset");
resetButton.addEventListener("click", resetBoard);

// Boton de borrar score
const resetScoreButton = document.querySelector("#btnResetScore");
resetScoreButton.addEventListener("click", resetScore);
