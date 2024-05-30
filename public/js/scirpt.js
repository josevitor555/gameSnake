document.addEventListener('DOMContentLoaded', () => {
    const game = document.getElementById('game');
    const scoreDisplay = document.getElementById('score');
    const menu = document.getElementById('menu');
    const restartButton = document.getElementById('restart-button');
    const gameWidth = game.offsetWidth;
    const gameHeight = game.offsetHeight;
    const snakeSize = 20;
    const wallSize = 40;
    const fps = 10;

    let food = { x: 0, y: 0 };
    let snake = [{ x: Math.floor(gameWidth / 2 / snakeSize) * snakeSize, y: Math.floor(gameHeight / 2 / snakeSize) * snakeSize }];
    let direction = { x: 0, y: 0 };
    let score = 0;
    let gameInterval;
    let walls = [];

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
        const scoreElement = document.getElementById('score');
        game.innerHTML = '';
        game.appendChild(scoreElement);

        walls.forEach(wall => {
            const wallElement = document.createElement('div');
            wallElement.style.left = `${wall.x}px`;
            wallElement.style.top = `${wall.y}px`;
            wallElement.classList.add('wall');
            game.appendChild(wallElement);
        });

        snake.forEach(segment => {
            const snakeElement = document.createElement('div');
            snakeElement.style.left = `${segment.x}px`;
            snakeElement.style.top = `${segment.y}px`;
            snakeElement.classList.add('snake');
            game.appendChild(snakeElement);
        });
    }

    function drawFood() {
        const foodElement = document.createElement('div');
        foodElement.style.left = `${food.x}px`;
        foodElement.style.top = `${food.y}px`;
        foodElement.classList.add('food');
        game.appendChild(foodElement);
    }

    function moveSnake() {
        const head = {
            x: snake[0].x + direction.x,
            y: snake[0].y + direction.y
        };

        // Check for collision with the walls
        if (head.x < wallSize || head.x >= gameWidth - wallSize || head.y < wallSize || head.y >= gameHeight - wallSize) {
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

            const randomX = Math.floor(Math.random() * ((maxX - minX) / snakeSize + 1)) * snakeSize + minX;
            const randomY = Math.floor(Math.random() * ((maxY - minY) / snakeSize + 1)) * snakeSize + minY;

            position = { x: randomX, y: randomY };
        } while (isWall(position) || isSnake(position));
        food = position;
    }

    function isWall(position) {
        return walls.some(wall => wall.x === position.x && wall.y === position.y);
    }

    function isSnake(position) {
        return snake.some(segment => segment.x === position.x && segment.y === position.y);
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
        menu.style.display = 'flex';
    }

    function resetGame() {
        snake = [{ x: Math.floor(gameWidth / 2 / snakeSize) * snakeSize, y: Math.floor(gameHeight / 2 / snakeSize) * snakeSize }];
        direction = { x: 0, y: 0 };
        score = 0;
        updateScoreDisplay();
        generateFoodPosition();
        menu.style.display = 'none';
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
        switch (event.key) {
            case 'w':
            case 'W':
            case 'ArrowUp':
                if (direction.y !== snakeSize) {
                    direction = { x: 0, y: -snakeSize };
                }
                break;
            case 's':
            case 'S':
            case 'ArrowDown':
                if (direction.y !== -snakeSize) {
                    direction = { x: 0, y: snakeSize };
                }
                break;
            case 'a':
            case 'A':
            case 'ArrowLeft':
                if (direction.x !== snakeSize) {
                    direction = { x: -snakeSize, y: 0 };
                }
                break;
            case 'd':
            case 'D':
            case 'ArrowRight':
                if (direction.x !== -snakeSize) {
                    direction = { x: snakeSize, y: 0 };
                }
                break;
        }
    }

    restartButton.addEventListener('click', resetGame);
    document.addEventListener('keydown', changeDirection);

    createWalls();
    generateFoodPosition();
    gameInterval = setInterval(updateGame, 1000 / fps);
});
