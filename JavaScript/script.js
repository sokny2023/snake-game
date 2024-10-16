// Game settings
const boardSize = 300;  // Width and height of the game board
const gridSize = 20;    // Size of one grid cell (snake and food size)
let gameSpeed = 450;    // Default game speed (milliseconds per tick)

const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const startBtn = document.getElementById('start-btn');
const pauseResumeBtn = document.getElementById('pause-resume-btn');
const stopBtn = document.getElementById('stop-btn');

// Difficulty controls
const difficultySelect = document.getElementById('difficulty');

// Mobile control buttons
const upBtn = document.getElementById('up-btn');
const downBtn = document.getElementById('down-btn');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');

let snake = [{ x: 100, y: 100 }];
let food = { x: 200, y: 200 };
let direction = { x: gridSize, y: 0 };
let score = 0;
let gameInterval;
let isGameRunning = false;
let isPaused = false;

// Function to initialize the game
function init() {
    document.addEventListener('keydown', changeDirectionByKey); // Keyboard control for desktop
    generateFood();
    updateScore(0);
    drawSnake();
    drawFood();
    pauseResumeBtn.textContent = 'Pause'; // Reset pause/resume button
}

// Function to start the game
function startGame() {
    if (!isGameRunning) {
        gameInterval = setInterval(update, gameSpeed);
        isGameRunning = true;
    }
}

// Function to pause or resume the game
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

// Function to stop the game
function stopGame() {
    clearInterval(gameInterval);
    resetGame();
    isGameRunning = false;
}

// Function to update the game state
function update() {
    moveSnake();
    checkCollision();
    drawSnake();
    drawFood();
}

// Function to draw the snake on the board
function drawSnake() {
    gameBoard.innerHTML = '';  // Clear the board
    snake.forEach((part, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.left = `${part.x}px`;
        snakeElement.style.top = `${part.y}px`;
        snakeElement.classList.add('snake');
        if (index === 0) {
            snakeElement.classList.add('snake-head');  // Add cute head to the snake
        }
        gameBoard.appendChild(snakeElement);
    });
}

// Function to move the snake
function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);  // Add new head to the front of the snake

    if (head.x === food.x && head.y === food.y) {
        score += 1;
        updateScore(score);
        generateFood();
    } else {
        snake.pop();  // Remove the last part of the snake (unless it eats food)
    }
}

// Function to change the snake direction by keyboard (desktop control)
function changeDirectionByKey(event) {
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -gridSize };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: gridSize };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -gridSize, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: gridSize, y: 0 };
            break;
    }
}

// Mobile control button functionality
upBtn.addEventListener('click', () => {
    if (direction.y === 0) direction = { x: 0, y: -gridSize };
});

downBtn.addEventListener('click', () => {
    if (direction.y === 0) direction = { x: 0, y: gridSize };
});

leftBtn.addEventListener('click', () => {
    if (direction.x === 0) direction = { x: -gridSize, y: 0 };
});

rightBtn.addEventListener('click', () => {
    if (direction.x === 0) direction = { x: gridSize, y: 0 };
});

// Function to check for collisions with walls or self
function checkCollision() {
    const head = snake[0];

    // Check for wall collisions
    if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize) {
        gameOver();
    }

    // Check for self collisions
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            gameOver();
        }
    }
}

// Function to handle game over
function gameOver() {
    alert('Game Over!');
    stopGame();
}

// Function to generate food at a random location
function generateFood() {
    food.x = Math.floor(Math.random() * (boardSize / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (boardSize / gridSize)) * gridSize;
}

// Function to draw food on the board
function drawFood() {
    const foodElement = document.createElement('div');
    foodElement.style.left = `${food.x}px`;
    foodElement.style.top = `${food.y}px`;
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
}

// Function to update the score display
function updateScore(newScore) {
    scoreDisplay.textContent = `Score: ${newScore}`;
}

// Function to reset the game state
function resetGame() {
    clearInterval(gameInterval);
    snake = [{ x: 100, y: 100 }];
    direction = { x: gridSize, y: 0 };
    score = 0;
    updateScore(score);
    generateFood();
    drawSnake();
    drawFood();
}

// Function to handle difficulty change
difficultySelect.addEventListener('change', function() {
    const selectedDifficulty = difficultySelect.value;

    // Adjust game speed based on selected difficulty
    switch (selectedDifficulty) {
        case 'easy':
            gameSpeed = 450;
            break;
        case 'medium':
            gameSpeed = 350;
            break;
        case 'hard':
            gameSpeed = 220;
            break;
        case 'very-hard':
            gameSpeed = 170;
            break;
    }

    // If the game is already running, restart it with the new speed
    if (isGameRunning && !isPaused) {
        clearInterval(gameInterval);
        gameInterval = setInterval(update, gameSpeed);
    }
});

// Event listeners for start, pause/resume, and stop buttons
startBtn.addEventListener('click', startGame);
pauseResumeBtn.addEventListener('click', togglePauseResume);
stopBtn.addEventListener('click', stopGame);

// Initialize the game
init();
