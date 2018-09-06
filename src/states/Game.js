/* globals __DEV__ */
import Phaser from 'phaser'
import Brick from '../prefab/Brick'
import Paddle from '../prefab/Paddle'
import Ball from '../prefab/Ball'


export default class extends Phaser.State {

  constructor(){
    super()
    this.ballOnPaddle = true
  }


  init() { }

  preload() { }

  create() {
    console.log(this.game.global)
    this.setUpText()
    this.setUpBricks()
    this.setUpPaddle()
    this.setUpBall()
  }

  setUpBall(){
  this.ball = new Ball(this.game)
  this.game.add.existing(this.ball)
  this.putBallOnPaddle()
  }

  putBallOnPaddle(){
      this.ballOnPaddle = true
     this.ball.reset(this.paddle.body.x, this.paddle.y - this.paddle.body.height)
  }

  setUpPaddle(){
    this.paddle = new Paddle(
      this.game,
      this.game.world.centerX,
      this.game.world.height-200
    )
    this.game.add.existing(this.paddle)
  }

  setUpBricks(){
    this.bricks = this.game.add.group()
    this.generateBricks(this.bricks)
  }

  generateBricks(bricksGroup){
    let rows = 5
    let columns = 15
    let xOffset = 70
    let yOffset = 45
    let brick

    for (let y=0; y<rows; y++){
      for (let x=0; x<columns; x++){
        brick = new Brick(
          this.game,
          x * xOffset,
          y * yOffset
        )
        bricksGroup.add(brick)
      }
    }
    let brickGroupWidth = ((xOffset * columns) -  (xOffset - brick.width))/2
    bricksGroup.position.setTo(
        this.game.world.centerX - brickGroupWidth,
        this.game.world.centerY - 250
    )
  }

  setUpText(){
  this.createText(20,20,'left', 'Score: ' + this.game.global.score)
  this.createText(20,40,'left', 'Lives: ' + this.game.global.lives)
  this.createText(20,60,'left', 'Level: ' + this.game.global.level)
}

  createText(xOffset, yOffset, align, text){
    return this.game.add.text(
      xOffset,
      yOffset,
      text,
      {
        font:'18px Arial',
        fill: '#000',
        boundsAlignH: align
      }
    ).setTextBounds(0,0, this.game.world.width,0)
  }

update(){
  if (this.ballOnPaddle){
    this.ball.body.x = this.paddle.x - (this.ball.width / 2)
  }
}


  render() {

  }
}
