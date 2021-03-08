var mario, marioAnim,marioCollided, edges;
var groundImg, ground;
var brickImg;
var bgimg;
var score = 0;
var obstacleAnim, obstaclesGroup, bricksGroup;
const PLAY = 1,END = 0;
var gameState;
var gameOver,restart,gameOverImg,restartImg
var invisibleBrick,invisibleBrickGroup;
var mushroom,mushroomImg;

function preload() {

  marioAnim = loadAnimation("mario00.png", "mario01.png", "mario02.png", "mario03.png");
  
  groundImg = loadImage("ground3.png");
  
  brickImg = loadImage("brick.png");
  
  bgimg = loadImage("bg1.PNG");
  
  obstacleAnim = loadAnimation("obstacle1.png", "obstacle2.png", "obstacle3.png", "obstacle4.png");

  marioCollided = loadAnimation("collided.png");

  gameOverImg = loadImage("gameOver.png");

  restartImg = loadImage("restart.png");

  mushroomImg = loadImage("Mush_Resize_img_28x26.png");

}


function setup() {
  //setting canvas wrt device
  createCanvas(displayWidth, displayHeight);
  
  mario = createSprite(displayWidth/2-500, displayHeight-130, 10, 10);
  mario.addAnimation("mariorunning", marioAnim);
  mario.scale = 2;
  
  ground = createSprite(displayWidth/4,displayHeight-120);
  ground.addImage("ground", groundImg);
  ground.scale = 2
   
  edges = createEdgeSprites();

  obstaclesGroup = new Group();
  bricksGroup = new Group();
  invisibleBrickGroup = new Group()

  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);


}

function draw() {
  background(bgimg);

  if(gameState === undefined){

    textSize(30);
    fill('white');
    text("Press Space to start the game", displayWidth/2-200, displayHeight/2-150);

    gameOver.visible = false;
    restart.visible = false;

      if(keyDown("space")){
        gameState = PLAY;
      }

  }
  textSize(25);
  fill('white');
  text("Score: " + score, displayWidth/2+600,displayHeight/10);

  if (gameState === PLAY) {
 
   gameOver.visible = false;
   restart.visible = false;

   score = score + Math.round(getFrameRate()/60);

   ground.velocityX = -15;
 
    if (ground.x < 350) {
       ground.x = displayWidth-1000;
    }

    if (keyDown("space") && mario.y >= 150) {
      mario.velocityY = -15;
      //camera.position.x = displayWidth;
      //camera.position.y = mario.y;
    }

    mario.velocityY = mario.velocityY + 2.5;
  
    if(keyDown(LEFT_ARROW)){
      mario.x = mario.x-5;
    }
    
   
    mario.collide(edges[3]);
    mario.collide(ground);
    Spawnbricks();
    Spawnobstacles();
    
    if(mario.isTouching(bricksGroup)){

      mario.velocityY = 0;

    }
    
    if(mario.isTouching(invisibleBrickGroup)){
     
      mushroom_gen();


    }

    if (obstaclesGroup.isTouching(mario)) {

           gameState = END;

    }
  } else if (gameState === END) {

    gameOver.visible = true;
    restart.visible = true;

    mario.changeAnimation("Collided",marioCollided)

    ground.velocityX = 0;

    mario.velocityY = 0;

    bricksGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach(0);
    invisibleBrickGroup.setVelocityXEach(0);

    bricksGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
    invisibleBrickGroup.setLifetimeEach(-1);
   
    if (mousePressedOver(restart)) {
        reset();
    }
  }

  drawSprites();
}

function reset(){

  gameState = PLAY;

  gameOver.visible = false;
  restart.visible = false;

  bricksGroup.destroyEach();
  obstaclesGroup.destroyEach();
  invisibleBrickGroup.destroyEach();
  score = 0;

}

function Spawnbricks() {
  if (frameCount % 80 == 0) {
    var brick = createSprite(590, displayHeight/2+300);
    brick.y = Math.round(random(displayHeight/2, displayHeight/2-200));
    brick.addImage("brick", brickImg);
    brick.scale = 2.3;
    brick.velocityX = -7;
    brick.lifetime = 350;

    invisibleBrick = createSprite(brick.x,brick.y+40,70,60);
  //  console.log("before touch" + invisibleBrick.x);
    invisibleBrick.velocityX = -3;
    invisibleBrick.lifetime = 350; 
    invisibleBrick.visible = true;

    brick.depth = mario.depth;
    mario.depth = mario.depth + 1;

    bricksGroup.add(brick);
    invisibleBrickGroup.add(invisibleBrick);
  }
}

function Spawnobstacles() {
  if (frameCount % 100 === 0) {
    var obstacle = createSprite(displayWidth/2,displayHeight-220);
    obstacle.scale = 0.75;
    obstacle.addAnimation("obs", obstacleAnim);
    obstacle.velocityX = -15;
    obstacle.lifetime = 250;

    obstaclesGroup.add(obstacle);
  }
}

function mushroom_gen(){
 // console.log("function"+invisibleBrick.x);
  mushroom = createSprite(mario.x,mario.y-100,50,50);
  //console.log("mushroom"+mushroom.x)
  mushroom.addImage(mushroomImg);
  mushroom.velocityY = -1;
  mushroom.velocityX = -1;

  mushroom.scale = 1.5;
  console.log("Mario" + mario.depth);
  console.log("Mushroom"+mushroom.depth)

  mushroom.depth = mario.depth;
  mario.depth+=2;  

}