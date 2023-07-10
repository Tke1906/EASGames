class Fighter {
  constructor({ position, velocity, color = 'red', offset }) {
    this.position = position
    this.velocity = velocity
    this.width = 50
    this.height = 150
    this.lastKey

    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset,
      width: 100,
      height: 50
    }
    this.color = color

    this.isAttacking
    this.isSpecialAttack

    this.health = 100

    this.specialKey = 0
  }

  draw() {
    ctx.fillStyle = this.color
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)

    // ctx.fillStyle = 'green'
    // ctx.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // )
  }

  // vamos criar uma função update()
  update() {
    this.draw()
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x
    this.attackBox.position.y = this.position.y

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0
    } else this.velocity.y += gravity

    if (this.position.x + this.width >= canvas.width) {
      this.position.x = canvas.width - this.width
      console.log('go')
    } else if (this.position.x <= 0) {
      this.position.x = 1
    }
  }
  specialAttack() {
    setTimeout(() => {
      this.isSpecialAttacking = true
      this.specialKey++
    }, 1)
  }
  attack() {
    setTimeout(() => {
      this.isAttacking = true
    }, 1)
    this.isAttacking = false
  }
}
class Sprite {
  constructor({ position, imageSrc, scale = 1, frame = 1 }) {
    this.position = position

    this.width = 50
    this.height = 150
    this.image = new Image()
    this.image.src = imageSrc
    this.scale = scale
    this.frame = frame
    this.frameCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 8
  }

  draw() {
    ctx.drawImage(
      this.image,

      this.frameCurrent * (this.image.width / this.frame),
      0,
      this.image.width / this.frame,
      this.image.height,
      this.position.x,
      this.position.y,
      (this.image.width / this.frame) * this.scale,
      this.image.height * this.scale
    )
  }

  // vamos criar uma função update()
  update() {
    this.draw()
    this.framesElapsed++
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.frameCurrent < this.frame - 1) {
        this.frameCurrent++
      } else {
        this.frameCurrent = 0
      }
    }
  }
}
