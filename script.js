const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 600;

// Load images
const carImage = new Image();
carImage.src = "player-car.png"; // Replace with your car image

const enemyCarImage = new Image();
enemyCarImage.src = "enemy-car.png"; // Replace with enemy car image

let car = { x: 180, y: 500, width: 40, height: 60, speed: 5, acceleration: 0.1 };
let enemyCars = [];
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let isGameRunning = true;
let gameInterval;
let keysPressed = { up: false, down: false, left: false, right: false };

// Generate enemy cars
function generateEnemyCars() {
  enemyCars = [
    { x: 100, y: -100, width: 40, height: 60, speed: 3 },
    { x: 200, y: -300, width: 40, height: 60, speed: 4 },
  ];
}
generateEnemyCars();

// Draw road lines (Fixed)
let roadY = 0;
function drawRoad() {
  ctx.fillStyle = "gray";
  ctx.fillRect(0, roadY, canvas.width, canvas.height);  // Road background
  ctx.fillRect(0, roadY - canvas.height, canvas.width, canvas.height); // Second part of the road for continuous effect

  // Draw white dashed lines on the road (fixed at the center)
  ctx.strokeStyle = "white";
  ctx.lineWidth = 5;
  ctx.setLineDash([20, 15]); // Dash pattern
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, roadY);
  ctx.lineTo(canvas.width / 2, roadY + canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
}

// Move road to create scrolling effect
function moveRoad() {
  roadY += 5; // Speed of road moving down
  if (roadY >= canvas.height) {
    roadY = 0;  // Reset road position to create an infinite loop
  }
}

// Move car
function moveCar() {
  if (keysPressed.up && car.y > 0) car.y -= car.speed;
  if (keysPressed.down && car.y < canvas.height - car.height) car.y += car.speed;
  if (keysPressed.left && car.x > 0) car.x -= car.speed;
  if (keysPressed.right && car.x < canvas.width - car.width) car.x += car.speed;
}

// Button event listeners for movement
document.getElementById("upBtn").addEventListener("mousedown", () => keysPressed.up = true);
document.getElementById("downBtn").addEventListener("mousedown", () => keysPressed.down = true);
document.getElementById("leftBtn").addEventListener("mousedown", () => keysPressed.left = true);
document.getElementById("rightBtn").addEventListener("mousedown", () => keysPressed.right = true);

document.getElementById("upBtn").addEventListener("mouseup", () => keysPressed.up = false);
document.getElementById("downBtn").addEventListener("mouseup", () => keysPressed.down = false);
document.getElementById("leftBtn").addEventListener("mouseup", () => keysPressed.left = false);
document.getElementById("rightBtn").addEventListener("mouseup", () => keysPressed.right = false);

// Keyboard controls
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") keysPressed.up = true;
  if (e.key === "ArrowDown") keysPressed.down = true;
  if (e.key === "ArrowLeft") keysPressed.left = true;
  if (e.key === "ArrowRight") keysPressed.right = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp") keysPressed.up = false;
  if (e.key === "ArrowDown") keysPressed.down = false;
  if (e.key === "ArrowLeft") keysPressed.left = false;
  if (e.key === "ArrowRight") keysPressed.right = false;
});

// Stop button
document.getElementById("stopBtn").addEventListener("click", () => {
  isGameRunning = !isGameRunning;
  if (isGameRunning) {
    document.getElementById("stopBtn").style.backgroundColor = "red";
    document.getElementById("stopBtn").innerText = "Stop";
    startGame();
  } else {
    document.getElementById("stopBtn").style.backgroundColor = "green";
    document.getElementById("stopBtn").innerText = "Resume";
    clearInterval(gameInterval);
  }
});

// Restart button
document.getElementById("restartBtn").addEventListener("click", () => location.reload());

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawRoad(); // Draw road with fixed white line
  moveRoad(); // Move road to create scrolling effect

  // Move car and enemy cars
  moveCar();

  // Draw car
  ctx.drawImage(carImage, car.x, car.y, car.width, car.height);

  // Draw enemy cars
  enemyCars.forEach((enemy) => {
    enemy.y += enemy.speed;
    if (enemy.y > canvas.height) {
      enemy.y = -60;
      score++;
      enemy.x = Math.random() * (canvas.width - enemy.width);
    }
    ctx.drawImage(enemyCarImage, enemy.x, enemy.y, enemy.width, enemy.height);

    // Collision detection
    if (
      car.x < enemy.x + enemy.width &&
      car.x + car.width > enemy.x &&
      car.y < enemy.y + enemy.height &&
      car.y + car.height > enemy.y
    ) {
      gameOver();
    }
  });

  // Update score
  document.getElementById("score").innerText = score;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }
  document.getElementById("highScore").innerText = highScore;
}

// Game over
function gameOver() {
  clearInterval(gameInterval);
  isGameRunning = false;
  alert(`Game Over! Your score: ${score}`);
}

// Start game
function startGame() {
  gameInterval = setInterval(draw, 1000 / 60);
}

startGame();


// Button event listeners for movement (Mouse + Touch Support)
function addControlListeners(buttonId, direction) {
  const button = document.getElementById(buttonId);
  
  button.addEventListener("mousedown", () => keysPressed[direction] = true);
  button.addEventListener("mouseup", () => keysPressed[direction] = false);
  button.addEventListener("mouseleave", () => keysPressed[direction] = false); // In case finger moves away

  button.addEventListener("touchstart", (e) => {
    e.preventDefault(); // Prevent default scrolling
    keysPressed[direction] = true;
  });

  button.addEventListener("touchend", (e) => {
    e.preventDefault();
    keysPressed[direction] = false;
  });
}

// Add event listeners to buttons
addControlListeners("upBtn", "up");
addControlListeners("downBtn", "down");
addControlListeners("leftBtn", "left");
addControlListeners("rightBtn", "right");
