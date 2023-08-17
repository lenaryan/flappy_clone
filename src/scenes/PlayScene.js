import BaseScene from "./BaseScene";

const PIPES_TO_RENDER = 4;
const FLAP_VELOCITY = 300;

class PlayScene extends BaseScene {
    constructor(config) {
        super('PlayScene', config);

        this.bird = null;
        this.pipes = null;

        this.pipeVerticalDistanceRange = [150, 250];
        this.pipeHorizontalDistanceRange = [350, 400];

        this.score = 0;
        this.scoreText = '';
    }

    create() {
        super.create();
        this.createBird();
        this.createPipes();
        this.createColliders();
        this.createScore();
        this.createPauseButton();
        this.handleInputs();
    }

    update(time, delta) {
        this.checkGameStatus();
        this.recyclePipes();
    }

    createBird() {
        this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird').setOrigin(0.5);
        this.bird.body.gravity.y = 600;
        this.bird.setCollideWorldBounds(true);
    }

    createPipes() {
        this.pipes = this.physics.add.group();

        for (let i = 0; i < PIPES_TO_RENDER; i++) {
          const upperPipe = this.pipes.create(0, 0, 'pipe')
            .setImmovable(true)
            .setOrigin(0, 1);
          const lowerPipe = this.pipes.create(0, 0, 'pipe')
             .setImmovable(true)
            .setOrigin(0);
      
          this.placePipe(upperPipe, lowerPipe);
        }
      
        this.pipes.setVelocityX(-200);
    }

    createColliders() {
        this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);  
    }

    createScore() {
        this.score = 0;
        this.bestScore = localStorage.getItem('best-score');
        this.scoreText = this.add.text(
            16, 
            16, 
            `Score: 0`, 
            { fontSize: '32px', fill: '#000'}
        );
        this.bestScoreText = this.add.text(
            16, 
            50, 
            `Best score: ${this.bestScore}`, 
            { fontSize: '18px', fill: '#000'}
        );
    }

    createPauseButton() {
        const pauseButton = this.add.image(this.config.width - 10, this.config.height - 10, 'pause')
            .setInteractive()
            .setScale(2)
            .setOrigin(1);

        pauseButton.on('pointerdown', () => {
            this.physics.pause();
            this.scene.pause();
            this.scene.launch('PauseScene');
        })
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
              this.increaseScore(); 
            }
          }
        })
    }

    flap() {
        this.bird.body.velocity.y = -FLAP_VELOCITY;
    }

    increaseScore() {
        this.score += 1;
        this.scoreText.setText(`Score ${this.score}`);
    }
    
    getRightMostPipe() {
        let rightX = 0;
        
        this.pipes.getChildren().forEach(function(pipe) {
            rightX = Math.max(pipe.x, rightX);
        })
        
        return rightX;
    }

    checkGameStatus() {
        if (this.bird.getBounds().bottom >= this.config.height || this.bird.getBounds().top <= 0 ) {
            this.gameOver();
        }
    }

    saveBestScore() {
        const best = localStorage.getItem('best-score');
        if (!best || this.score > best) {
            localStorage.setItem('best-score', this.score);
        }
    }

    gameOver() {
        this.physics.pause();
        this.bird.setTint(0xbada55);
        this.saveBestScore();

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.restart();
            },
            loop: false
        })
    }
}

export default PlayScene;