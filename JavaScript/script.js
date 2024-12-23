// Game settings
const boardSize = 300;  // Width and height of the game board
const gridSize = 20;    // Size of one grid cell (snake and food size)
let gameSpeed = 450;    // Default game speed (milliseconds per tick)

// HTML elements
const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const startBtn = document.getElementById('start-btn');
const pauseResumeBtn = document.getElementById('pause-resume-btn');
const stopBtn = document.getElementById('stop-btn');
const difficultySelect = document.getElementById('difficulty');

// Mobile control buttons
const upBtn = document.getElementById('up-btn');
const downBtn = document.getElementById('down-btn');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');

// Game state variables
let snake = [{ x: 100, y: 100 }];
let food = { x: 0, y: 0 }; // Single food item
let direction = { x: gridSize, y: 0 };
let score = 0;
let gameInterval;
let isGameRunning = false;
let isPaused = false;

// Initialize game
function init() {
    document.addEventListener('keydown', changeDirectionByKey); // Keyboard control
    generateFood();
    updateScore(0);
    drawSnake();
    drawFood();
    pauseResumeBtn.textContent = 'Pause';
}

// Start game
function startGame() {
    if (!isGameRunning) {
        gameInterval = setInterval(update, gameSpeed);
        isGameRunning = true;
    }
}

// Pause or resume game
function togglePauseResume() {
    if (isPaused) {
        gameInterval = setInterval(update, gameSpeed);
        pauseResumeBtn.textContent = 'Pause';
    } else {
        clearInterval(gameInterval);
        pauseResumeBtn.textContent = 'Resume';
    }
    isPaused = !isPaused;
}

// Stop game
function stopGame() {
    clearInterval(gameInterval);
    resetGame();
    isGameRunning = false;
}

// Update game state
function update() {
    moveSnake();
    checkCollision();
    drawSnake();
    drawFood();
}

// Draw the snake
function drawSnake() {
    gameBoard.innerHTML = ''; // Clear board
    snake.forEach((part, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.left = `${part.x}px`;
        snakeElement.style.top = `${part.y}px`;
        snakeElement.classList.add('snake');
        if (index === 0) {
            snakeElement.classList.add('snake-head');
        }
        gameBoard.appendChild(snakeElement);
    });
}

// Move the snake
function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 1;
        updateScore(score);
        generateFood();
    } else {
        snake.pop(); // Remove last part if no food eaten
    }
}

// Change direction with keyboard input
function changeDirectionByKey(event) {
    const { key } = event;
    if (key === 'ArrowUp' && direction.y === 0) direction = { x: 0, y: -gridSize };
    if (key === 'ArrowDown' && direction.y === 0) direction = { x: 0, y: gridSize };
    if (key === 'ArrowLeft' && direction.x === 0) direction = { x: -gridSize, y: 0 };
    if (key === 'ArrowRight' && direction.x === 0) direction = { x: gridSize, y: 0 };
}

// Mobile controls
upBtn.addEventListener('click', () => changeDirectionByKey({ key: 'ArrowUp' }));
downBtn.addEventListener('click', () => changeDirectionByKey({ key: 'ArrowDown' }));
leftBtn.addEventListener('click', () => changeDirectionByKey({ key: 'ArrowLeft' }));
rightBtn.addEventListener('click', () => changeDirectionByKey({ key: 'ArrowRight' }));

// Check collisions
function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize) {
        gameOver();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
        }
    }
}

// Game over handler
function gameOver() {
    alert('Game Over!');
    stopGame();
}

// Generate food
function generateFood() {
    let x, y;
    let validPosition = false;

    while (!validPosition) {
        x = Math.floor(Math.random() * (boardSize / gridSize)) * gridSize;
        y = Math.floor(Math.random() * (boardSize / gridSize)) * gridSize;

        validPosition = !snake.some(part => part.x === x && part.y === y);
    }

    food = { x, y };
}

// Draw food
function drawFood() {
    const foodElement = document.createElement('div');
    foodElement.style.left = `${food.x}px`;
    foodElement.style.top = `${food.y}px`;
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
}

// Update score
function updateScore(newScore) {
    scoreDisplay.textContent = `Score: ${newScore}`;
}

// Reset game
function resetGame() {
    snake = [{ x: 100, y: 100 }];
    direction = { x: gridSize, y: 0 };
    score = 0;
    updateScore(score);
    generateFood();
    drawSnake();
    drawFood();
}

// Difficulty setting
difficultySelect.addEventListener('change', () => {
    const selected = difficultySelect.value;
    gameSpeed = { easy: 450, medium: 350, hard: 220, 'very-hard': 170 }[selected];

    if (isGameRunning && !isPaused) {
        clearInterval(gameInterval);
        gameInterval = setInterval(update, gameSpeed);
    }
});

// Event listeners for start, pause/resume, and stop buttons
startBtn.addEventListener('click', startGame);
pauseResumeBtn.addEventListener('click', togglePauseResume);
stopBtn.addEventListener('click', stopGame);

// Initialize game
init();
