import Phaser from "phaser";

const PIPES_TO_RENDER = 4;
const FLAP_VELOCITY = 250;

class PlayScene extends Phaser.Scene {
    constructor(config) {
        super('PlayScene');
        this.config = config;
        this.bird = null;
        this.pipes = null;

        this.pipeVerticalDistanceRange = [150, 250];
        this.pipeHorizontalDistanceRange = [350, 400];
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('bird', 'assets/bird.png');
        this.load.image('pipe', 'assets/pipe.png');
    }

    create() {
        this.createBG();
        this.createBird();
        this.createPipes();
        this.handleInputs();
    }

    update(time, delta) {
        this.checkGameStatus();
        this.recyclePipes();
    }

    createBG() {
        this.add.image(0, 0, 'sky').setOrigin(0);
    }

    createBird() {
        this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird').setOrigin(0.5);
        this.bird.body.gravity.y = 400;
    }

    createPipes() {
        this.pipes = this.physics.add.group();

        for (let i = 0; i < PIPES_TO_RENDER; i++) {
          const upperPipe = this.pipes.create(0, 0, 'pipe').setOrigin(0, 1);
          const lowerPipe = this.pipes.create(0, 0, 'pipe').setOrigin(0);
      
          this.placePipe(upperPipe, lowerPipe);
        }
      
        this.pipes.setVelocityX(-200);
    }

    handleInputs() {
        const spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.input.on('pointerdown', this.flap, this);
        spaceBar.on('down', this.flap, this);
    }

    placePipe(upper, lower) {
        // TODO: wtf, it's looping through the whole pipe array every time to get X
        // probably it's easier to get position of the last pipe only
        const rightMostX = this.getRightMostPipe();
        const pipeHorizontalDistance = Phaser.Math.Between(this.pipeHorizontalDistanceRange[0], this.pipeHorizontalDistanceRange[1])
        const pipeVerticalDistance = Phaser.Math.Between(this.pipeVerticalDistanceRange[0], this.pipeVerticalDistanceRange[1]);
        const pipeVerticalPosition = Phaser.Math.Between(20, this.config.height - 20 - pipeVerticalDistance);
      
        upper.x = rightMostX + pipeHorizontalDistance;
        lower.x = upper.x;
        upper.y = pipeVerticalPosition;
        lower.y = upper.y + pipeVerticalDistance;  
    }

    recyclePipes() {
        // TODO: maybe look at the first one only
        // for not to loop through the whole array every fucking second
        // remove the first one after placing pipe
        const tempPipes = [];
        this.pipes.getChildren().forEach(pipe => {
          if (pipe.getBounds().right <= 0) {
            // recycle
            tempPipes.push(pipe);
            if (tempPipes.length === 2) {
              // why is it working with no cleaning of the temp array?
              this.placePipe(...tempPipes);
            }
          }
        })
    }

    flap() {
        this.bird.body.velocity.y = -FLAP_VELOCITY;
    }
    
    restartBirdPosition() {
        this.bird.x = this.config.startPosition.x;
        this.bird.y = this.config.startPosition.y;
        this.bird.body.velocity.y = 0;
    }
    
    getRightMostPipe() {
        let rightX = 0;
        
        this.pipes.getChildren().forEach(function(pipe) {
            rightX = Math.max(pipe.x, rightX);
        })
        
        return rightX;
    }

    checkGameStatus() {
        if (this.bird.y > this.config.height || this.bird.y < -this.bird.height) {
            this.restartBirdPosition();
        }
    }
}

export default PlayScene;