document.addEventListener('DOMContentLoaded', () => {
    const game = document.getElementById('game');
    const gameWidth = game.offsetWidth;
    const gameHeight = game.offsetHeight;
    const snakeSize = 20;
    const fps = 10;
    
    let food = {
        x: 0,
        y: 0
    };
    let snake = [
        {
            x: 0,
            y: 0
        }
    ];
    let direction = {
        x: 0,
        y: 0
    };

    function createSnake() {
        game.innerHTML = '';
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
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

        if (head.x < 0) {
            head.x = gameWidth - snakeSize;
        } else if (head.x >= gameWidth) {
            head.x = 0;
        }

        if (head.y < 0) {
            head.y = gameHeight - snakeSize;
        } else if (head.y >= gameHeight) {
            head.y = 0;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            const tail = { ...snake[snake.length - 1] };
            snake.push(tail);
            generateFoodPosition();
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

    function changeDirection(event) {
        switch (event.key) {
            case 'w':
            case 'W':
                if (direction.y !== snakeSize) {
                    direction = { x: 0, y: -snakeSize };
                }
                break;
            case 's':
            case 'S':
                if (direction.y !== -snakeSize) {
                    direction = { x: 0, y: snakeSize };
                }
                break;
            case 'a':
            case 'A':
                if (direction.x !== snakeSize) {
                    direction = { x: -snakeSize, y: 0 };
                }
                break;
            case 'd':
            case 'D':
                if (direction.x !== -snakeSize) {
                    direction = { x: snakeSize, y: 0 };
                }
                break;
        }
    }

    function generateFoodPosition() {
        const randomX = Math.floor(Math.random() * (gameWidth / snakeSize)) * snakeSize;
        const randomY = Math.floor(Math.random() * (gameHeight / snakeSize)) * snakeSize;
        food = { x: randomX, y: randomY };
    }

    function checkSelfCollision() {
        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
                resetGame();
                return;
            }
        }
    }

    function resetGame() {
        snake = [
            {
                x: 0,
                y: 0 
            }
        ];
        generateFoodPosition();
    }

    document.addEventListener('keydown', changeDirection);

    generateFoodPosition();
    setInterval(updateGame, 1000 / fps);
});
