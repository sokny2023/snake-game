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
let foods = []; // Array to hold one or two food items at a time
let direction = { x: gridSize, y: 0 };
let score = 0;
let gameInterval;
let isGameRunning = false;
let isPaused = false;

// Food counters
let smallFoodCounter = 0;
let mediumFoodCounter = 0;
let largeFoodCounter = 0;

// Initialize game
function init() {
    document.addEventListener('keydown', changeDirectionByKey); // Keyboard control for desktop
    generateFood();
    updateScore(0);
    drawSnake();
    drawFood();
    pauseResumeBtn.textContent = 'Pause'; // Reset pause/resume button
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

// Draw the snake on the board
function drawSnake() {
    gameBoard.innerHTML = '';  // Clear the board
    snake.forEach((part, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.left = `${part.x}px`;
        snakeElement.style.top = `${part.y}px`;
        snakeElement.classList.add('snake');
        if (index === 0) {
            snakeElement.classList.add('snake-head');  // Add head to the snake
        }
        gameBoard.appendChild(snakeElement);
    });
}

// Move the snake
function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);  // Add new head to the front of the snake

    // Check if snake eats any food
    const ateFood = foods.some((food, index) => {
        if (head.x === food.x && head.y === food.y) {
            score += food.score;
            updateScore(score);
            foods.splice(index, 1);  // Remove the eaten food
            generateFood();
            return true;
        }
    });

    if (!ateFood) {
        snake.pop();  // Remove the last part if no food is eaten
    }
}

// Change direction with keyboard input
function changeDirectionByKey(event) {
    const { key } = event;
    if (key === 'ArrowUp' && direction.y === 0) {
        direction = { x: 0, y: -gridSize };
    } else if (key === 'ArrowDown' && direction.y === 0) {
        direction = { x: 0, y: gridSize };
    } else if (key === 'ArrowLeft' && direction.x === 0) {
        direction = { x: -gridSize, y: 0 };
    } else if (key === 'ArrowRight' && direction.x === 0) {
        direction = { x: gridSize, y: 0 };
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

// Check for collisions (walls or self)
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

// Generate food based on counters and sequence
function generateFood() {
    let newFoods = [];

    if (smallFoodCounter < 2 || (smallFoodCounter < 8 && Math.random() > 0.5)) {
        newFoods.push(createFood('small', 1, 'white'));
        smallFoodCounter++;
    }
    if (smallFoodCounter >= 2 && mediumFoodCounter < 3 && Math.random() > 0.6) {
        newFoods.push(createFood('medium', 3, 'red'));
        mediumFoodCounter++;
        smallFoodCounter = 0;
    }
    if (mediumFoodCounter >= 2 || smallFoodCounter >= 5) {
        newFoods.push(createFood('large', 5, 'blue'));
        mediumFoodCounter = 0;
        smallFoodCounter = 0;
    }
    if (Math.random() > 0.7 && newFoods.length === 1) {
        newFoods.push(createFood('small', 1, 'white'));
    }

    foods = newFoods;
}

// Create a food object with given properties
function createFood(type, score, color) {
    return {
        x: Math.floor(Math.random() * (boardSize / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (boardSize / gridSize)) * gridSize,
        type,
        score,
        color
    };
}


// Function to draw food on the board
function drawFood() {
    foods.forEach(food => {
        const foodElement = document.createElement('div');
        foodElement.style.left = `${food.x}px`;
        foodElement.style.top = `${food.y}px`;

        // Set different styles for each food type including border-radius
        switch (food.type) {
            case 'small':
                foodElement.style.width = '15px';
                foodElement.style.height = '15px';
                foodElement.style.backgroundColor = 'white';
                foodElement.style.borderRadius = '50%';  // Circular shape
                break;
            case 'medium':
                foodElement.style.width = '20px';
                foodElement.style.height = '20px';
                foodElement.style.backgroundColor = 'red';
                foodElement.style.borderRadius = '50%';  // Circular shape
                break;
            case 'large':
                foodElement.style.width = '25px';
                foodElement.style.height = '25px';
                foodElement.style.backgroundColor = 'blue';
                foodElement.style.borderRadius = '50%';  // Circular shape
                break;
        }
        foodElement.classList.add('food');
        gameBoard.appendChild(foodElement);
    });
}



// Update the score display
function updateScore(newScore) {
    scoreDisplay.textContent = `Score: ${newScore}`;
}

// Reset game state
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

// Handle difficulty change
difficultySelect.addEventListener('change', function() {
    const selectedDifficulty = difficultySelect.value;

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

    if (isGameRunning && !isPaused) {
        clearInterval(gameInterval);
        gameInterval = setInterval(update, gameSpeed);
    }
});

// Event listeners for start, pause/resume, and stop buttons
startBtn.addEventListener('click', startGame);
pauseResumeBtn.addEventListener('click', togglePauseResume);
stopBtn.addEventListener('click', stopGame);

// Start the game initialization
init();
