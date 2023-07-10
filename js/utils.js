function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  )
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId)
  if (player.health === enemy.health) {
    document.querySelector('#textDisplay').style.display = 'flex'
    document.querySelector('#textDisplay p').textContent = 'Empate'
  } else if (player.health > enemy.health) {
    document.querySelector('#textDisplay').style.display = 'flex'
    document.querySelector('#textDisplay p').textContent = 'jogador 1 ganhou'
    document.querySelector('#enemyHealth').style.width = 0 + '%'
  } else if (enemy.health > player.health) {
    document.querySelector('#textDisplay').style.display = 'flex'
    document.querySelector('#textDisplay p').textContent = 'jogador 2 ganhou'
    document.querySelector('#playerHealth').style.width = 0 + '%'
  }

  window.removeEventListener('keydown', keysConfig)
  controllerIndex = null
  window.addEventListener('keydown', skip)
}

document
  .querySelector('#textDisplay #restartButton')
  .addEventListener('click', () => {
    location.reload(true)
  })

let timerId
let timer = 30
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000)
    timer--
    document.querySelector('#timer').innerText = timer
  }
  if (timer === 0) {
    determineWinner({ player, enemy, timerId })
  }
}
