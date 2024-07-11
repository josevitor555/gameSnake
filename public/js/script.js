document.addEventListener("DOMContentLoaded", () => {
  const game = document.getElementById("game");
  const scoreDisplay = document.getElementById("score");
  const menu = document.getElementById("menu");
  const restartButton = document.getElementById("restart-button");
  const scoresButton = document.getElementById("scores-button");
  const creditsButton = document.getElementById("credits-button");
  const backButtonScores = document.getElementById("back-button-scores");
  const backButtonCredits = document.getElementById("back-button-credits");
  const clearButton = document.getElementById("clear-button");
  const scoresMenu = document.getElementById("scores-menu");
  const creditsMenu = document.getElementById("credits-menu");
  const scoresList = document.getElementById("scores-list");
  const gameWidth = game.offsetWidth;
  const gameHeight = game.offsetHeight;
  const snakeSize = 20;
  const wallSize = 40;
  const fps = 10;

  let food = { x: 0, y: 0 };
  let snake = [
    {
      x: Math.floor(gameWidth / 4 / snakeSize) * snakeSize,
      y: Math.floor(gameHeight / 4 / snakeSize) * snakeSize,
    }
  ];
  let direction = { x: 0, y: 0 };
  let score = 0;
  let gameInterval;
  let walls = [];
  let startTime;
  let elapsedTime;
  let gameStarted = false;
  const tree = {
    x: (gameWidth - 100) / 2,
    y: (gameHeight - 118) / 2,
    width: 100,
    height: 118
  };
  const treeBarrier = {
    x1: tree.x,
    y1: tree.y,
    x2: tree.x + tree.width,
    y2: tree.y + tree.height
  };

  function createWalls() {
    for (let i = 0; i < gameWidth; i += wallSize) {
      walls.push({ x: i, y: 0 });
      walls.push({ x: i, y: gameHeight - wallSize });
    }
    for (let i = wallSize; i < gameHeight - wallSize; i += wallSize) {
      walls.push({ x: 0, y: i });
      walls.push({ x: gameWidth - wallSize, y: i });
    }
  }

  function createSnake() {
    const scoreElement = document.getElementById("score");
    game.innerHTML = "";
    game.appendChild(scoreElement);

    walls.forEach((wall) => {
      const wallElement = document.createElement("div");
      wallElement.style.left = `${wall.x}px`;
      wallElement.style.top = `${wall.y}px`;
      wallElement.classList.add("wall");
      game.appendChild(wallElement);
    });

    snake.forEach((segment, index) => {
      const snakeElement = document.createElement("div");
      snakeElement.style.left = `${segment.x}px`;
      snakeElement.style.top = `${segment.y}px`;
      if (index === 0) {
        snakeElement.classList.add("snake-head");
      } else if (index === snake.length - 1) {
        snakeElement.classList.add("snake-tail");
      } else {
        snakeElement.classList.add("snake-body");
      }
      game.appendChild(snakeElement);
    });

    // Create and position the tree element
    let treeElement = document.getElementById("tree");
    if (!treeElement) {
      treeElement = document.createElement("div");
      treeElement.id = "tree";
      treeElement.classList.add("tree");
      game.appendChild(treeElement);
    }
    treeElement.style.left = `${tree.x}px`;
    treeElement.style.top = `${tree.y}px`;
    treeElement.style.width = `${tree.width}px`;
    treeElement.style.height = `${tree.height}px`;
  }

  function drawFood() {
    const foodElement = document.createElement("div");
    foodElement.style.left = `${food.x}px`;
    foodElement.style.top = `${food.y}px`;
    foodElement.classList.add("food");
    game.appendChild(foodElement);
  }

  function moveSnake() {
    const head = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y,
    };

    if (
      head.x < wallSize ||
      head.x >= gameWidth - wallSize ||
      head.y < wallSize ||
      head.y >= gameHeight - wallSize ||
      (head.x >= treeBarrier.x1 &&
        head.x < treeBarrier.x2 &&
        head.y >= treeBarrier.y1 &&
        head.y < treeBarrier.y2)
    ) {
      endGame();
      return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      const tail = { ...snake[snake.length - 1] };
      snake.push(tail);
      generateFoodPosition();
      updateScore();
    } else {
      snake.pop();
    }

    snake[0] = head;

    checkSelfCollision();
  }

  function updateGame() {
    moveSnake();
    createSnake();
    drawFood();
  }

  function generateFoodPosition() {
    let position;
    do {
      const minX = wallSize;
      const maxX = gameWidth - wallSize - snakeSize;
      const minY = wallSize;
      const maxY = gameHeight - wallSize - snakeSize;

      const randomX =
        Math.floor(Math.random() * ((maxX - minX) / snakeSize + 1)) *
          snakeSize +
        minX;
      const randomY =
        Math.floor(Math.random() * ((maxY - minY) / snakeSize + 1)) *
          snakeSize +
        minY;

      position = { x: randomX, y: randomY };
    } while (
      isWall(position) ||
      isSnake(position) ||
      (position.x >= treeBarrier.x1 &&
        position.x < treeBarrier.x2 &&
        position.y >= treeBarrier.y1 &&
        position.y < treeBarrier.y2)
    );
    food = position;
  }

  function isWall(position) {
    return walls.some((wall) => wall.x === position.x && wall.y === position.y);
  }

  function isSnake(position) {
    return snake.some(
      (segment) => segment.x === position.x && segment.y === position.y
    );
  }

  function checkSelfCollision() {
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
        endGame();
        return;
      }
    }
  }

  function endGame() {
    clearInterval(gameInterval);
    elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Calculate elapsed time in seconds
    saveScore(score, elapsedTime);
    menu.style.display = "flex";
    gameStarted = false; // Reset the game started flag
  }

  function resetGame() {
    // Ensure the snake starts in a different position than the tree
    snake = [
      {
        x: Math.floor(gameWidth / 4 / snakeSize) * snakeSize,
        y: Math.floor(gameHeight / 4 / snakeSize) * snakeSize,
      },
    ];
    direction = { x: 0, y: 0 };
    score = 0;

    updateScoreDisplay();
    generateFoodPosition();

    menu.style.display = "none";
    scoresMenu.style.display = "none";
    creditsMenu.style.display = "none";
    gameStarted = false; // Reset the game started flag
    gameInterval = setInterval(updateGame, 1000 / fps);
  }

  function updateScore() {
    score++;
    updateScoreDisplay();
  }

  function updateScoreDisplay() {
    scoreDisplay.textContent = `Current Score: ${score}`;
  }

  function changeDirection(event) {
    if (!gameStarted) {
      startTime = Date.now();
      gameStarted = true;
    }

    switch (event.key) {
      case "w":
      case "W":
      case "ArrowUp":
        if (direction.y !== snakeSize) {
          direction = { x: 0, y: -snakeSize };
        }
        break;
      case "s":
      case "S":
      case "ArrowDown":
        if (direction.y !== -snakeSize) {
          direction = { x: 0, y: snakeSize };
        }
        break;
      case "a":
      case "A":
      case "ArrowLeft":
        if (direction.x !== snakeSize) {
          direction = { x: -snakeSize, y: 0 };
        }
        break;
      case "d":
      case "D":
      case "ArrowRight":
        if (direction.x !== -snakeSize) {
          direction = { x: snakeSize, y: 0 };
        }
        break;
    }
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }

  function saveScore(score, duration) {
    const id = generateId();
    const newScore = { id, score, duration };
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    scores.push(newScore);
    localStorage.setItem("scores", JSON.stringify(scores));
    displayScores();
  }

  function generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  function displayScores() {
    scoresList.innerHTML = "";
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    if (scores.length === 0) {
      const emptyMessage = document.createElement("li");
      emptyMessage.textContent = "Table Empty. Back To Your Game, Human.";
      scoresList.appendChild(emptyMessage);
    } else {
      scores.forEach((score) => {
        const scoreItem = document.createElement("li");
        scoreItem.innerHTML = `
                    <span>ID: ${score.id}</span>
                    <span>Time: ${formatTime(score.duration)}</span>
                    <span>Score: ${score.score}</span>
                `;
        scoresList.appendChild(scoreItem);
      });
    }
  }

  function clearScores() {
    localStorage.removeItem("scores");
    displayScores();
  }

  restartButton.addEventListener("click", resetGame);
  scoresButton.addEventListener("click", () => {
    displayScores();
    scoresMenu.style.display = "flex";
  });
  creditsButton.addEventListener("click", () => {
    creditsMenu.style.display = "flex";
  });
  backButtonScores.addEventListener("click", () => {
    scoresMenu.style.display = "none";
  });
  backButtonCredits.addEventListener("click", () => {
    creditsMenu.style.display = "none";
  });
  clearButton.addEventListener("click", clearScores);

  document.addEventListener("keydown", changeDirection);

  createWalls();
  generateFoodPosition();
  gameInterval = setInterval(updateGame, 1000 / fps);
});
