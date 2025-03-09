const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 500; // Reduced height to make space for controls

// Game state
let paddleWidth = 100, paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2;
const paddleY = canvas.height - 40;
const paddleSpeed = 7;

let ballRadius = 10;
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballDX = 4, ballDY = -4;
let score = 0;
const scoreBoard = document.getElementById('scoreBoard');
const gameOverText = document.getElementById('gameOverText');

// Control flags
let leftPressed = false, rightPressed = false;
let isGameOver = false;

// Touch controls
document.getElementById('leftBtn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    leftPressed = true;
});
document.getElementById('leftBtn').addEventListener('touchend', (e) => {
    e.preventDefault();
    leftPressed = false;
});
document.getElementById('rightBtn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    rightPressed = true;
});
document.getElementById('rightBtn').addEventListener('touchend', (e) => {
    e.preventDefault();
    rightPressed = false;
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') leftPressed = true;
    if (e.key === 'ArrowRight') rightPressed = true;
});
document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') leftPressed = false;
    if (e.key === 'ArrowRight') rightPressed = false;
});

// Random color generator
function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

// Convert number to Khmer numerals
function toKhmerNumerals(number) {
    const khmerNumerals = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
    return number.toString().split('').map(digit => khmerNumerals[digit]).join('');
}

// Game over function
function gameOver() {
    isGameOver = true;
    gameOverText.classList.remove('hidden');
    gameOverText.classList.add('visible');
}

// Update game state
function update() {
    if (isGameOver) return;

    // Paddle movement
    if (leftPressed && paddleX > 0) paddleX -= paddleSpeed;
    if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += paddleSpeed;

    // Ball movement
    ballX += ballDX;
    ballY += ballDY;

    // Wall collisions
    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) ballDX = -ballDX;
    if (ballY - ballRadius < 0) ballDY = -ballDY;

    // Paddle collision
    if (
        ballY + ballRadius >= paddleY &&
        ballX >= paddleX - ballRadius &&
        ballX <= paddleX + paddleWidth + ballRadius
    ) {
        if (ballDY > 0) { // Prevent score glitch by checking ball direction
            ballDY = -ballDY;
            score += 10;
            scoreBoard.textContent = `ពិន្ទុ: ${toKhmerNumerals(score)}`;
            canvas.style.borderColor = getRandomColor(); // Change border color
        }
    }

    // Game over condition (ball below paddle)
    if (ballY - ballRadius > canvas.height) {
        gameOver();
    }
}

// Draw game objects
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw "MK" background text
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.font = '120px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('MK', canvas.width / 2, canvas.height / 2);

    // Draw paddle with random color
    ctx.fillStyle = getRandomColor();
    ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);

    // Draw ball with random color
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = getRandomColor();
    ctx.fill();
    ctx.closePath();
}

// Main game loop
function gameLoop() {
    if (!isGameOver) {
        update();
        draw();
    }
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();