(()=>{"use strict";var e,t={494:(e,t,s)=>{var i=s(260),n=s.n(i);class r extends n().Scene{constructor(e,t){super(e),this.config=t,this.fontSize="32px",this.lineHeight=42,this.screenCenter=[t.width/2,t.height/2]}create(){if(this.add.image(0,0,"sky").setOrigin(0),this.config.canGoBack){this.add.image(this.config.width-10,this.config.height-10,"back").setOrigin(1).setScale(2).setInteractive().on("pointerup",(()=>{this.scene.start("MenuScene")}))}}createMenu(e,t){let s=0;e.forEach((e=>{const i=[this.screenCenter[0],this.screenCenter[1]+s];e.textGO=this.add.text(...i,e.text,{fontSize:this.fontSize,fill:"#fff"}).setOrigin(.5,1),s+=this.lineHeight,t(e)}))}}const c=r;const a=class extends c{constructor(e){super("PlayScene",e),this.bird=null,this.pipes=null,this.isPaused=!1,this.score=0,this.scoreText="",this.difficulties={easy:{pipeHorizontalDistanceRange:[300,350],pipeVerticalDistanceRange:[150,200]},normal:{pipeHorizontalDistanceRange:[280,330],pipeVerticalDistanceRange:[140,190]},hard:{pipeHorizontalDistanceRange:[250,310],pipeVerticalDistanceRange:[120,170]}}}create(){this.currentDifficulty="easy",super.create(),this.createBird(),this.createPipes(),this.createColliders(),this.createScore(),this.createPauseButton(),this.handleInputs(),this.listenToEvents()}update(e,t){this.checkGameStatus(),this.recyclePipes()}createBird(){this.bird=this.physics.add.sprite(this.config.startPosition.x,this.config.startPosition.y,"bird").setOrigin(.5),this.bird.body.gravity.y=600,this.bird.setCollideWorldBounds(!0)}createPipes(){this.pipes=this.physics.add.group();for(let e=0;e<4;e++){const e=this.pipes.create(0,0,"pipe").setImmovable(!0).setOrigin(0,1),t=this.pipes.create(0,0,"pipe").setImmovable(!0).setOrigin(0);this.placePipe(e,t)}this.pipes.setVelocityX(-200)}createColliders(){this.physics.add.collider(this.bird,this.pipes,this.gameOver,null,this)}createScore(){this.score=0,this.bestScore=localStorage.getItem("best-score"),this.scoreText=this.add.text(16,16,"Score: 0",{fontSize:"32px",fill:"#000"}),this.bestScoreText=this.add.text(16,50,`Best score: ${this.bestScore}`,{fontSize:"18px",fill:"#000"})}createPauseButton(){this.add.image(this.config.width-10,this.config.height-10,"pause").setInteractive().setScale(2).setOrigin(1).on("pointerdown",(()=>{this.isPaused=!0,this.physics.pause(),this.scene.pause(),this.scene.launch("PauseScene")}))}handleInputs(){const e=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);this.input.on("pointerdown",this.flap,this),e.on("down",this.flap,this)}listenToEvents(){this.pauseEvent||(this.pauseEvent=this.events.on("resume",(()=>{this.initialTime=3,this.countDownText=this.add.text(...this.screenCenter,"Fly in: "+this.initialTime,{fontSize:this.fontSize,fill:"#fff"}).setOrigin(.5,1),this.timeEvent=this.time.addEvent({delay:1e3,callback:this.countDown,callbackScope:this,loop:!0})})))}countDown(){this.countDownText.setText("Fly in: "+--this.initialTime),this.initialTime<=0&&(this.isPaused=!1,this.countDownText.setText(""),this.physics.resume(),this.timeEvent.remove())}placePipe(e,t){const s=this.difficulties[this.currentDifficulty],i=this.getRightMostPipe(),n=Phaser.Math.Between(...s.pipeHorizontalDistanceRange),r=Phaser.Math.Between(...s.pipeVerticalDistanceRange),c=Phaser.Math.Between(20,this.config.height-20-r);e.x=i+n,t.x=e.x,e.y=c,t.y=e.y+r}recyclePipes(){const e=[];this.pipes.getChildren().forEach((t=>{t.getBounds().right<=0&&(e.push(t),2===e.length&&(this.placePipe(...e),this.increaseScore(),this.increaseDifficulty()))}))}increaseDifficulty(){5===this.score&&(this.currentDifficulty="normal"),10===this.score&&(this.currentDifficulty="hard")}flap(){this.isPaused||(this.bird.body.velocity.y=-300)}increaseScore(){this.score+=1,this.scoreText.setText(`Score ${this.score}`)}getRightMostPipe(){let e=0;return this.pipes.getChildren().forEach((function(t){e=Math.max(t.x,e)})),e}checkGameStatus(){(this.bird.getBounds().bottom>=this.config.height||this.bird.getBounds().top<=0)&&this.gameOver()}saveBestScore(){const e=localStorage.getItem("best-score");(!e||this.score>e)&&localStorage.setItem("best-score",this.score)}gameOver(){this.physics.pause(),this.bird.setTint(12245589),this.saveBestScore(),this.time.addEvent({delay:1e3,callback:()=>{this.scene.restart()},loop:!1})}};const o=class extends c{constructor(e){super("MenuScene",e),this.menu=[{scene:"PlayScene",text:"Play"},{scene:"ScoreScene",text:"Score"},{scene:null,text:"Exit"}]}create(){super.create(),this.createMenu(this.menu,this.setupMenuEvents.bind(this))}setupMenuEvents(e){const t=e.textGO.setInteractive();t.on("pointerover",(()=>{t.setStyle({fill:"#ff0"})})),t.on("pointerout",(()=>{t.setStyle({fill:"#fff"})})),t.on("pointerup",(()=>{e.scene&&this.scene.start(e.scene),"Exit"===e.text&&this.game.destroy(!0)}))}};class h extends n().Scene{constructor(){super("PreloadScene")}preload(){this.load.image("sky","assets/sky.png"),this.load.image("bird","assets/bird.png"),this.load.image("pipe","assets/pipe.png"),this.load.image("pause","assets/pause.png"),this.load.image("back","assets/back.png")}create(){this.scene.start("MenuScene")}}const l=h;const p=class extends c{constructor(e){super("ScoreScene",{...e,canGoBack:!0})}create(){super.create(),this.add.text(...this.screenCenter,`Best Score: ${localStorage.getItem("best-score")||0}`,{fontSize:this.fontSize,fill:"#fff"}).setOrigin(.5,1)}};const u=class extends c{constructor(e){super("PauseScene",e),this.menu=[{scene:"PlayScene",text:"Continue"},{scene:"MenuScene",text:"Exit"}]}create(){super.create(),this.createMenu(this.menu,this.setupMenuEvents.bind(this))}setupMenuEvents(e){const t=e.textGO.setInteractive();t.on("pointerover",(()=>{t.setStyle({fill:"#ff0"})})),t.on("pointerout",(()=>{t.setStyle({fill:"#fff"})})),t.on("pointerup",(()=>{e.scene&&"Continue"===e.text?(this.scene.stop(),this.scene.resume(e.scene)):(this.scene.stop("PlayScene"),this.scene.start(e.scene))}))}},d={width:400,height:600,startPosition:{x:40,y:300}},f=[l,o,a,p,u],g=e=>new e(d),y={type:n().AUTO,...d,physics:{default:"arcade",arcade:{debug:!0}},scene:f.map(g)};new(n().Game)(y)}},s={};function i(e){var n=s[e];if(void 0!==n)return n.exports;var r=s[e]={exports:{}};return t[e].call(r.exports,r,r.exports,i),r.exports}i.m=t,e=[],i.O=(t,s,n,r)=>{if(!s){var c=1/0;for(l=0;l<e.length;l++){for(var[s,n,r]=e[l],a=!0,o=0;o<s.length;o++)(!1&r||c>=r)&&Object.keys(i.O).every((e=>i.O[e](s[o])))?s.splice(o--,1):(a=!1,r<c&&(c=r));if(a){e.splice(l--,1);var h=n();void 0!==h&&(t=h)}}return t}r=r||0;for(var l=e.length;l>0&&e[l-1][2]>r;l--)e[l]=e[l-1];e[l]=[s,n,r]},i.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return i.d(t,{a:t}),t},i.d=(e,t)=>{for(var s in t)i.o(t,s)&&!i.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={143:0};i.O.j=t=>0===e[t];var t=(t,s)=>{var n,r,[c,a,o]=s,h=0;if(c.some((t=>0!==e[t]))){for(n in a)i.o(a,n)&&(i.m[n]=a[n]);if(o)var l=o(i)}for(t&&t(s);h<c.length;h++)r=c[h],i.o(e,r)&&e[r]&&e[r][0](),e[r]=0;return i.O(l)},s=self.webpackChunkphaser_webpack_boilerplate=self.webpackChunkphaser_webpack_boilerplate||[];s.forEach(t.bind(null,0)),s.push=t.bind(null,s.push.bind(s))})();var n=i.O(void 0,[736],(()=>i(494)));n=i.O(n)})();