import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  },
  scene: [PlayScene]
}

const PIPES_TO_RENDER = 4;
let bird = null;
let pipes = null;
const pipeVerticalDistanceRange = [150, 250];
const pipeHorizontalDistanceRange = [350, 400];
const flapVelocity = 250;
const initialBirdPosition = { x: config.width * 0.1, y: config.height / 2};

function preload() {
  this.load.image('pipe', 'assets/pipe.png');
}

function create() {
  pipes = this.physics.add.group();

  for (let i = 0; i < PIPES_TO_RENDER; i++) {
    const upperPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 1);
    const lowerPipe = pipes.create(0, 0, 'pipe').setOrigin(0);

    placePipe(upperPipe, lowerPipe);
  }

  pipes.setVelocityX(-200);

  const spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  this.input.on('pointerdown', flap);
  spaceBar.on('down', flap);
}

function update(time, delta) {
  if (bird.y > config.height || bird.y < -bird.height) restartBirdPosition();
  recyclePipes();
}

function flap() {
  bird.body.velocity.y = -flapVelocity;
}

function restartBirdPosition() {
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
  bird.body.velocity.y = 0;
}

function placePipe(upper, lower) {
  // TODO: wtf, it's looping through the whole pipe array every time to get X
  // probably it's easier to get position of the last pipe only
  const rightMostX = getRightMostPipe();
  const pipeHorizontalDistance = Phaser.Math.Between(pipeHorizontalDistanceRange[0], pipeHorizontalDistanceRange[1])
  const pipeVerticalDistance = Phaser.Math.Between(pipeVerticalDistanceRange[0], pipeVerticalDistanceRange[1]);
  const pipeVerticalPosition = Phaser.Math.Between(20, config.height - 20 - pipeVerticalDistance);

  upper.x = rightMostX + pipeHorizontalDistance;
  lower.x = upper.x;
  upper.y = pipeVerticalPosition;
  lower.y = upper.y + pipeVerticalDistance;  
}

function recyclePipes() {
  // TODO: maybe look at the first one only
  // for not to loop through the whole array every fucking second
  // remove the first one after placing pipe
  const tempPipes = [];
  pipes.getChildren().forEach(pipe => {
    if (pipe.getBounds().right <= 0) {
      // recycle
      tempPipes.push(pipe);
      if (tempPipes.length === 2) {
        // why is it working with no cleaning of the temp array?
        placePipe(...tempPipes);
      }
      debugger
    }
  })
}

function getRightMostPipe() {
  let rightX = 0;

  pipes.getChildren().forEach(function(pipe) {
    rightX = Math.max(pipe.x, rightX);
  })

  return rightX;
}

new Phaser.Game(config);