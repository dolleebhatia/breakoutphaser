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
    this.game.physics.arcade.checkCollision.down = false

    this.setUpText()
    this.setUpBricks()
    this.setUpPaddle()
    this.setUpBall()

    this.game.input.onDown.add(this.releaseBall, this)
  }

releaseBall(){
    if(!this.ballOnPaddle){
      return
    }
    this.ballOnPaddle = false
    this.ball.body.velocity.y = -300
    this.ball.body.velocity.x = -30
}

  setUpBall(){
  this.ball = new Ball(this.game)
  this.game.add.existing(this.ball)
  this.ball.events.onOutOfBounds.add(this.ballLost, this)

  this.putBallOnPaddle()

  }

  ballLost(){
  -- this.game.global.lives
    this.livesText.text = 'Lives: ' + this.game.global.lives
  if(this.game.global.lives === 0){
      this.endGame()
    return
  }
  this.putBallOnPaddle()
}

  endGame(){
    //console.log("gameover")
    this.game.state.start('Gameover')
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
  this.scoreText = this.createText(20,20,'left', 'Score: ' + this.game.global.score)
  this.livesText = this.createText(20,40,'left', 'Lives: ' + this.game.global.lives)
  this.levelText = this.createText(20,60,'left', 'Level: ' + this.game.global.level)
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

  this.game.physics.arcade.collide(
    this.ball,
    this.paddle,
    this.ballHitPaddle,
    null,
    this
  )

  this.game.physics.arcade.collide(
    this.ball,
    this.bricks,
    this.ballHitBrick,
    null,
    this
  )


}


ballHitPaddle (ball, paddle){

  let diff = 0

    if(ball.x<paddle.x){
    diff = paddle.x - ball.x
    ball.body.velocity.x = (-10*diff)
    return
    }

    if(paddle.x<ball.x){
    diff = ball.x - paddle.x
    ball.body.velocity.x = (10*diff)
    return
    }
}

ballHitBrick(ball, brick){
  brick.kill()
  this.game.global.score +=10
  //console.log(this.game.global.score)
  this.scoreText.text = 'Score: ' + this.game.global.score
  //console.log(this.bricks.countLiving())
    if(this.bricks.countLiving()){
      return
    }
  this.game.global.level += 1
  this.levelText.text = 'Level: ' + this.game.global.level
  this.putBallOnPaddle()
  this.generateBricks(this.bricks)

}

  render() {

  }
}
