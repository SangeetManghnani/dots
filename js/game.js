// Copyright © 2014 Demircan Celebi
// Licensed under the terms of the MIT License
    
var GameState = function(game) {};

score = 0;

GameState.prototype.preload = function() {
    this.game.load.image('circle','assets/circle.png');
    this.game.load.image('block','assets/block.png');
    this.game.load.audio('theme','assets/theme.mp3');
};

GameState.prototype.create = function() {

    //background color
    this.game.stage.backgroundColor = 0x333333;
    this.music = game.add.audio('theme');
    this.music.play();
    
    //gamespeed
    this.gameSpeed = 1 ;
    //Game score
    this.score = -2;
    
    //Game Instructions
    style1 = { font: '32px Arial', fill: '#ffffff', align: 'center' };
    this.instructionsLabel = this.game.add.text(this.game.width/2, this.game.height/2,"Use left/right arrow keys\n\n\n\n\n\nAvoid blocks!\n\n\nPress SpaceBar to mute/Enter to unmute",style1);
    this.game.add.tween(this.instructionsLabel).delay(1000).to({alpha : 0},2000).start();
    this.instructionsLabel.anchor.setTo(0.5,0.5);
    
    //Score Label
    var style = { font: '72px Arial', fill:'#ffffff' };
    this.scoreLabel = this.game.add.text(this.game.width/2,this.game.height/2,"0",style);
    this.scoreLabel.anchor.setTo(0.5,0.5);

    
    //Positioning the circles 
    var offset = this.game.width/4;
    this.circle1 = this.game.add.sprite(offset,0,'circle');
    this.circle2 = this.game.add.sprite(-offset,0,'circle');
    
    //Adding color to the circles
    this.circle1.tint = 0x2EEF43;
    this.circle2.tint = 0xE03C43;
    
    this.circle1.anchor.setTo(0.5, 0.5);
    this.circle2.anchor.setTo(0.5, 0.5);
    
    this.circleGroup = this.game.add.group();
    
    this.circleGroup.x = this.game.width/2 ;
    this.circleGroup.y = this.game.height/2;
    
    this.circleGroup.add(this.circle1);
    this.circleGroup.add(this.circle2);
    
    //Block Group
    this.blocks = this.game.add.group();
    this.blocks.createMultiple(5,'block');
    
    //scaling all the blocks
    this.blocks.setAll('scale.y',6);
    
    //Enable physics on blocks and circleGroups
    this.game.physics.arcade.enable(this.blocks);
    this.game.physics.arcade.enable(this.circleGroup);
    
    //timer 
    this.timer = this.game.time.events.loop(3000,this.addBlock,this);
    
    
};

GameState.prototype.update = function() {
  
    if(this.input.keyboard.isDown(Phaser.Keyboard.LEFT))
       this.rotate(-2);
    if(this.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
       this.rotate(2);
   
    //Pause and Resume Music
    if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        this.music.pause();
    if(this.input.keyboard.isDown(Phaser.Keyboard.ENTER))
        this.music.resume();
    
    //Collision condition for circles
    this.game.physics.arcade.overlap(this.circle1,this.blocks,this.gameOver,null,this);
    this.game.physics.arcade.overlap(this.circle2,this.blocks,this.gameOver,null,this);
};

GameState.prototype.rotate = function(angle) {
    this.circleGroup.angle += angle*this.gameSpeed;  
    this.circle1.angle -= angle*this.gameSpeed;
    this.circle2.angle -= angle*this.gameSpeed;
};

//Function to add a block
GameState.prototype.addBlock = function() {
    this.gameSpeed *=1.02;
    this.timer.delay /= 1.02;
    var block = this.blocks.getFirstDead(), 
        rand = Math.floor(Math.random()*3);
    block.reset(this.game.width, rand*this.game.height/3);
    block.body.velocity.x = -150;
    score = this.score += 1;
    if(this.score>0)
        this.scoreLabel.text= this.score;
    this.blocks.forEachAlive(function (aliveBlock) {
        aliveBlock.body.velocity.x = -150*this.gameSpeed;},this);
    block.checkWorldBounds = true;
    block.outOfBoundsKill =true;
};

GameState.prototype.gameOver = function() {
    this.game.state.start('Score');
    this.game.time.events.remove(this.timer);
    this.music.stop();
};

var ScoreState = function(game) {};

ScoreState.prototype = {
    
create : function () {
  // Fix the score hack
  if(score < 0)
    score = 0;

  // Add instructions text
  var style = { font: '32px Arial', fill: '#ffffff', align: 'center' };
  this.finalScore = this.game.add.text(this.game.width/2, this.game.height/2, "Your score: " + score + "\n\nUp/down arrow key to play again", style);
  this.finalScore.anchor.setTo(0.5, 0.5);
},
    
update : function () {
  // Restart the game if player presses up or down arrow key
  if(this.input.keyboard.isDown(Phaser.Keyboard.UP) || this.input.keyboard.isDown(Phaser.Keyboard.DOWN))
    this.game.state.start('game');
}
    
};
// Setup game
var game = new Phaser.Game(800, 600, Phaser.AUTO,'game');
game.state.add('Score',ScoreState,true);
game.state.add('game', GameState, true);