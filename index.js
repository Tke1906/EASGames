const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
let controllerIndex = null
// Proporção: 1024 x 576

canvas.width = 1024
canvas.height = 576

const gravity = 0.7

// vamos fazer uma classe para os sprites que deve ter uma:
// posição (objeto)
// velocity ( object)

const player = new Fighter({
  position: { x: 200, y: 0 },
  velocity: { x: 0, y: 10 },
  offset: {
    x: 0,
    y: 0
  }
})
const enemy = new Fighter({
  position: { x: 700, y: 300 },
  velocity: { x: 0, y: 10 },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  }
})

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './assets/background.png'
})

const shop = new Sprite({
  position: {
    x: 620,
    y: 128
  },
  imageSrc: './assets/shop.png',
  scale: 2.75,
  frame: 6
})

decreaseTimer()

// vamos criar uma função para os frames rodarem com loop

function frames() {
  window.requestAnimationFrame(frames)

  tester()

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  // pintamos o fundo de preto
  ctx.fillStyle = 'gray'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  background.update()
  shop.update()

  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  // player config
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -2.5
    player.attackBox.offset.x = -50
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 2.5
    // player.attackBox.offset.x = -50

    player.attackBox.offset.x = 0
  }

  // enemy config
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -2.5

    enemy.attackBox.offset.x = -50
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 2.5
    enemy.attackBox.offset.x = 0
  }

  // detectar a colisão

  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking
  ) {
    player.isAttacking = false

    enemy.health -= 1
    document.querySelector('#enemyHealth').style.width = enemy.health + '%'
  }
  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false
    player.health -= 1
    document.querySelector('#playerHealth').style.width = player.health + '%'
  }

  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isSpecialAttacking &&
    player.specialKey === 1
  ) {
    setTimeout(() => {
      console.log('go')
      player.specialKey = 0
    }, 5000)
    player.isSpecialAttacking = false

    enemy.health -= 25
    document.querySelector('#enemyHealth').style.width = enemy.health + '%'
  }
  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isSpecialAttacking &&
    enemy.specialKey === 1
  ) {
    setTimeout(() => {
      console.log('go')
      enemy.specialKey = 0
    }, 5000)
    enemy.isSpecialAttacking = false

    player.health -= 25
    document.querySelector('#playerHealth').style.width = player.health + '%'
  }

  // fim de jogo baseado na vida

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }

  // player jump
  if (keys.w.isJumping && keys.w.jumpCount === 1) {
    player.velocity.y = -15
    setTimeout(() => {
      keys.w.isJumping = false
      console.log('player')
    }, 2000)
  }
  if (
    player.position.y + player.height + player.velocity.y >=
    canvas.height - 96
  ) {
    keys.w.jumpCount = 0
  }

  // enemy jump
  if (keys.ArrowUp.isJumping && keys.ArrowUp.jumpCount === 1) {
    enemy.velocity.y = -15
    setTimeout(() => {
      keys.ArrowUp.isJumping = false
    }, 20)
  }
  if (
    enemy.position.y + enemy.height + enemy.velocity.y >=
    canvas.height - 96
  ) {
    keys.ArrowUp.jumpCount = 0
  }

  // if (keys.Special.SpecialCount === 1) {
  //   player.isSpecialAttacking = false

  //   setTimeout(() => {
  //     console.log('go')
  //     keys.Special.SpecialCount = 0
  //   }, 5000)

  // if (keys.w.isJumping && keys.w.jumpCount == 1) {
  //   enemy.velocity.y = -20
  //   setTimeout(() => {
  //     keys.w.isJumping = false
  //     keys.w.jumpCount = 0
  //   }, 10)
  // }
}

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    jumpCount: 0,
    isJumping: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowUp: {
    jumpCount: 0,
    isJumping: false
  }
}

function skip(event) {
  console.log(event.key)
  switch (event.key) {
    case 'G':
    case 'g':
      location.reload(true)
  }
}

function gamepadconnected(event) {
  const gamepad = event.gamepad
  console.log(gamepad)
  console.log('connected gamepad')

  controllerIndex = gamepad.index
}

window.addEventListener('gamepadconnected', gamepadconnected)

function tester() {
  if (controllerIndex !== null) {
    const gamepad_1 = navigator.getGamepads()[0]
    const axes = gamepad_1.axes
    const buttons = gamepad_1.buttons
    if (buttons[0].value === 1) {
      keys.w.jumpCount++
      keys.w.isJumping = true
    }
    if (axes[0] > 0.5) {
      // console.log(gamepad)
      keys.d.pressed = true
      player.lastKey = 'd'
    }
    if (axes[0] < 0.5 && axes[0] > 0) {
      keys.d.pressed = false
    }

    if (axes[0] < -0.5) {
      keys.a.pressed = true
      player.lastKey = 'a'
    }
    if (axes[0] > -0.5 && axes[0] < 0) {
      keys.a.pressed = false
    }

    if (buttons[1].value === 1) {
      player.attack()
    }

    if (buttons[3].value === 1) {
      player.specialAttack()
      console.log('go')
    }
    const gamepad_2 = navigator.getGamepads()[1]
    const axes_2 = gamepad_2.axes
    const buttons_2 = gamepad_2.buttons

    if (buttons_2[0].value === 1) {
      keys.ArrowUp.jumpCount++
      keys.ArrowUp.isJumping = true
    }
    if (buttons_2[15].value === 1 || axes_2[0] > 0.5) {
      // console.log(gamepad)
      keys.ArrowRight.pressed = true
      enemy.lastKey = 'ArrowRight'
    }
    if (axes_2[0] < 0.5 && axes_2[0] > 0) {
      keys.ArrowRight.pressed = false
    }

    if (buttons_2[14].value === 1 || axes_2[0] < -0.5) {
      keys.ArrowLeft.pressed = true
      enemy.lastKey = 'ArrowLeft'
    }
    if (axes_2[0] > -0.5 && axes_2[0] < 0) {
      keys.ArrowLeft.pressed = false
    }

    if (buttons_2[1].value === 1) {
      enemy.attack()
    }
    if (buttons_2[3].value === 1) {
      enemy.specialAttack()

      console.log('go')
    }
  }
}

function keysConfig(event) {
  // player keys

  switch (event.key) {
    case 'a':
    case 'A':
      keys.a.pressed = true
      player.lastKey = 'a'
      break
    case 'd':
    case 'D':
      keys.d.pressed = true
      player.lastKey = 'd'
      break
    case 'w':
    case 'W':
      keys.w.jumpCount++
      keys.w.isJumping = true
      break

    case ' ':
      player.attack()

      break
  }
  // enemy keys
  switch (event.key) {
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      enemy.lastKey = 'ArrowLeft'
      break
    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      enemy.lastKey = 'ArrowRight'
      break
    case 'ArrowUp':
      keys.ArrowUp.isJumping = true
      keys.ArrowUp.jumpCount++
      break
    case 'ArrowDown':
      enemy.attack()
      break
  }
}

window.addEventListener('keydown', keysConfig)
window.addEventListener('keydown', skip)

window.addEventListener('keyup', event => {
  switch (event.key) {
    case 'a':
    case 'A':
      keys.a.pressed = false
      break
    case 'd':
    case 'D':
      keys.d.pressed = false
      break
  }
  switch (event.key) {
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
  }
})

frames()
