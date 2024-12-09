let leftTower, rightTower;
let player;
let platforms = [];
let rotatingPlatforms = [];
let selectedObject = null; 
let maxObjects = 1; 
let placedObjects = 0;
let showMenu = true; 
let finishingPad; 
let score = 0; 
let round = 1; 
let timer = 120; 
let gameOver = false;
let deathBarrier; 

function setup() {
  new Canvas(800, 800);
  world.gravity.y = 10;


  tower();

  playerObj();
  
}

function draw() {
  clear();

  if (gameOver) {
    displayGameOver();
    return;
  }

  if (showMenu) {
    displayMenu();
  } else {
   
    movement();

    // Check collisions with the death barrier
    if (player.colliding(deathBarrier)) nextRound(false);

    // Show object placement preview
    if (selectedObject) objectPlacement();

    
    textSize(16);

    fill(0);

    text(`Round: ${round}/5`, 100, 20);

    text(`Time Left: ${timer}s`, 100, 40);

    text(`Score: ${score}`, 100, 60);

    // Update the timer
    if (frameCount % 60 === 0 && timer > 0) timer--;

    
    if (timer === 0) {
      nextRound(false); 

      
    }

    
    
    if (player.colliding(finishingPad)) {

      nextRound(true); 

      
    }

    
    
    rotatingPlatforms.forEach(platform => {

      platform.rotation += 1; 
      
      platform.update();
      
    });
  }
}

function tower() {
  // Create tower objects

  leftTower = new Sprite(20, 750, 300, 400, "s");

  rightTower = new Sprite(780, 750, 300, 400, "s");

  leftTower.color = "grey";
  rightTower.color = "grey";

 
  
  finishingPad = new Sprite(780, 550, 100, 20, "s");
  finishingPad.color = "green";

 
  
  deathBarrier = new Sprite(400, 800, 800, 10, "k"); 
  
  deathBarrier.color = "black";
}

function playerObj() {

  player = new Sprite(70, 550, 20, 20); 

  player.friction = 0.09;

  player.color = "red";
}

function movement() {
  // Horizontal movement
  if (kb.pressing('a')) player.vel.x = -5;

  else if (kb.pressing('d')) player.vel.x = 5;

  else player.vel.x = 0;

  // Jump 
  if ((kb.presses('space') || kb.presses('w')) && canJump()) {
    player.vel.y = -5; 
  }

  // Stop downward motion when colliding

  if (canJump() && player.vel.y > 0) {

    player.vel.y = 0;

  }

}

function canJump() {
  // Check collisions with all platforms and towers
  return (
    player.colliding(leftTower) ||

    player.colliding(rightTower) ||

    platforms.some(platform => player.colliding(platform)) ||

    rotatingPlatforms.some(platform => player.colliding(platform))

  );
}

function displayMenu() {
  
  fill(255, 255, 255, 255);

  rect(0, 0, 800, 800);

  fill(200, 200, 255);
  rect(200, 150, 400, 500); 
  textSize(20);
  fill(0);
  textAlign(CENTER, CENTER);

  // Menu title

  text("Choose a Platform Type", 400, 200);

  // Platform type buttons

  fill(150, 150, 255);

  rect(300, 250, 200, 50); // Platform 1

  rect(300, 350, 200, 50); // Platform 2

  rect(300, 450, 200, 50); // Platform 3

  rect(300, 550, 200, 50); // Rotating Platform
  fill(0);
  text("Small Platform", 400, 275);

  text("Wide Platform", 400, 375);

  text("Tall Platform", 400, 475);

  text("Rotating Platform", 400, 575);

  if (mouse.presses()) {
    if (mouse.x > 300 && mouse.x < 500) {

      if (mouse.y > 250 && mouse.y < 300) {

        selectedObject = "small"; // Small platform

        showMenu = false;

      } else if (mouse.y > 350 && mouse.y < 400) {

        selectedObject = "wide"; // Wide platform

        showMenu = false;
      } else if (mouse.y > 450 && mouse.y < 500) {


        selectedObject = "tall"; // Tall platform

        showMenu = false;

      } else if (mouse.y > 550 && mouse.y < 600) {

        selectedObject = "rotating"; // Rotating platform

        showMenu = false;
      }
    }
  }
}

function objectPlacement() {

  if (placedObjects < maxObjects) {

    let mouseXGrid = Math.round(mouse.x / 20) * 20;

    let mouseYGrid = Math.round(mouse.y / 20) * 20;


    // Preview the placement

    noFill();

    stroke(0, 255, 0);

    if (selectedObject === "small") rect(mouseXGrid - 10, mouseYGrid - 10, 100, 20);

    else if (selectedObject === "wide") rect(mouseXGrid - 10, mouseYGrid - 10, 200, 20);

    else if (selectedObject === "tall") rect(mouseXGrid - 10, mouseYGrid - 10, 50, 50);

    else if (selectedObject === "rotating") ellipse(mouseXGrid, mouseYGrid, 100, 20);


    stroke(0, 0, 0);


    // Place object on click

    if (mouse.presses()) {

      if (selectedObject === "small") platforms.push(new Sprite(mouseXGrid, mouseYGrid, 100, 20, 's'));

      else if (selectedObject === "wide") platforms.push(new Sprite(mouseXGrid, mouseYGrid, 200, 20, 's'));

      else if (selectedObject === "tall") platforms.push(new Sprite(mouseXGrid, mouseYGrid, 50, 50, 's'));

      else if (selectedObject === "rotating") {
        let rotatingPlatform = new Sprite(mouseXGrid, mouseYGrid, 100, 20, 's');

        rotatingPlatform.rotation = 0;

        rotatingPlatform.update = function () {

          this.x = mouseXGrid; // Keep its position fixed

          this.y = mouseYGrid;

        };
        rotatingPlatforms.push(rotatingPlatform);

      }

      placedObjects++;
    }
  } else {

    textSize(16);

    fill(0);

    text("No more objects can be placed!", 10, 80);
  }

}

function nextRound(success) {
  if (success) {
    score += timer;
    round++;
    if (round > 5) {
      gameOver = true;
      return;
    }

    
    placedObjects = 0;

    selectedObject = null;

    showMenu = true; 
  }

  
  timer = 120;
  resetPlayer();
}

function resetPlayer() {
  // Reset player's position and velocity
  player.x = 70;
  player.y = 550;
  player.vel.x = 0;
  player.vel.y = 0;
}

function displayGameOver() {
  textSize(30);
  textAlign(CENTER, CENTER);
  fill(0);
  text(`Game Over!`, width / 2, height / 2 - 50);
  text(`Your Total Score: ${score}`, width / 2, height / 2);
}
