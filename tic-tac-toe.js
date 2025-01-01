const configBox = document.querySelector(".config-box"),
playBoard = document.querySelector(".play-board"),
resultBox = document.querySelector(".result-box"),
startBtn = document.querySelector(".start-btn"),
replayBtn = document.querySelector(".replay-btn"),
allBox = document.querySelectorAll("section span"),
players = document.querySelector(".players"),
wonText = document.querySelector(".won-text"),
confettiImg = document.querySelector(".result-img");

let board = ["", "", "", "", "", "", "", "", ""]
let playerType = '';
let currentPlayer = '';
let isRunning = false;
let isBotThinking = false;
let playerXIcon = "fas fa-times";
let playerOIcon = "far fa-circle";

const winningCondition = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

function updateBox(box, index) {
  console.log(`updateBox called for index ${index}, currentPlayer: ${currentPlayer}`);
  board[index] = currentPlayer;
  console.log(board)
  if(currentPlayer === "x"){
    box.innerHTML = `<i class="${playerXIcon}"></i>`
    players.setAttribute("class", "players S-active player")
  } else {
    box.innerHTML = `<i class="${playerOIcon}"></i>`
    players.setAttribute("class", "players player")
  }
}

function changePlayer() {
  currentPlayer = currentPlayer === "x" ? "o" : "x";
}

function botMove() {
  if (!isRunning) return;
  
  let availableBoxes = board.map((val, index) => val === "" ? index : null).filter(val => val !== null);
  if (availableBoxes.length > 0) {
    isBotThinking = true;
    
    playBoard.style.pointerEvents = 'none';
    
    setTimeout(() => {
      let randomBoxIndex = availableBoxes[Math.floor(Math.random() * availableBoxes.length)];
      let randomBox = allBox[randomBoxIndex];
      
      updateBox(randomBox, randomBoxIndex);
      checkWinner();
      
      isBotThinking = false;
      playBoard.style.pointerEvents = 'auto';

      if (isRunning) changePlayer();
    }, 500);
  }
}

function checkWinner() {
  let roundWon = false;

  for (let i = 0; i < winningCondition.length; i++) {
    const condition = winningCondition[i];
    
    const boxA = board[condition[0]],
          boxB = board[condition[1]],
          boxC = board[condition[2]];

    if(boxA === "" || boxB === "" || boxC === "") continue;
    if(boxA === boxB && boxB === boxC) {
      roundWon = true;
      break;
    }
  }

  if(roundWon) {
    isRunning = false;
    setTimeout(() => {
      playBoard.classList.add("hide");
      playBoard.classList.remove("show");
      resultBox.classList.add("show");
      wonText.innerHTML = `Player ${currentPlayer.toUpperCase()} won the game!`;

      let canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 600;
      resultBox.appendChild(canvas);

      let confetti_box = confetti.create(canvas);
      confetti_box({
        particleCount: 300,
        spread: 60, 
        origin: { y: 0.6 }
      }).then(() => resultBox.removeChild(canvas));

      confettiImg.classList.add("animate__animated", "animate__rubberBand");
    }, 1000);
  } else if(!board.includes("")) {
    isRunning = false;
    setTimeout(() => {
      playBoard.classList.add("hide");
      playBoard.classList.remove("show");
      resultBox.classList.add("show");
      wonText.innerHTML = "It's a draw!";
    }, 1000);
  }
}

function setupGame() {
  isRunning = true;
  
  allBox.forEach((box, index) => {
    box.addEventListener("click", () => {
      if (board[index] === "" && isRunning && !isBotThinking) {
        updateBox(box, index);
        checkWinner();
        
        if (isRunning) {
          if (playerType === "computer") {
            changePlayer();
            botMove();
          } else {
            changePlayer();
          }
        }
      }
    });
  });
}

startBtn.addEventListener('click', () => {
  playerType = document.querySelector(".type-option.active").textContent.toLowerCase().replace(/ /g, "");
  currentPlayer = document.querySelector(".player-option.active").textContent.toLowerCase().replace(/player|[ ]/g, "");
  
  configBox.classList.add("hide");
  playBoard.classList.add("show");

  if(currentPlayer === "o") players.setAttribute("class", "players S-active player");
  
  setupGame();
});

replayBtn.addEventListener('click', () => {
  location.reload();
});

document.querySelectorAll('.type-option, .player-option').forEach(option => {
  option.addEventListener('click', () => {
    option.parentNode.querySelector('.active').classList.remove('active');
    option.classList.add('active');
  });
});