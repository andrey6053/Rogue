class Game {
   constructor() {
      this.container = document.querySelector('.field')
      this.popup = document.querySelector(".popup")
      this.enemyPower = 10
      this.widthField = this.container.offsetWidth
      this.heightField = this.container.offsetHeight
      this.direction = [
         {direct:"right",where:[1, 0]},
         {direct:"left",where:[-1, 0]},
         {direct:"top",where:[0, -1]},
         {direct:"bottom",where:[0, 1]}
      ]
      this.columns = this.widthField / 50
      this.rows = this.heightField / 50
      document.querySelector(".popup__btn").addEventListener("click", () => this.init())
      document.addEventListener("keydown", (e) => {
         if (this.popup.style.display !== "none") return
         const keyName = e.key
         this.enemyRandomMove = this.direction[randomNum(this.direction.length, 0)].direct
         if (keyName === "w" || keyName==="ц") this.move("top")
         if (keyName === "s" || keyName==="ы") this.move("bottom")
         if (keyName === "a" || keyName==="ф") this.move("left")
         if (keyName === "d" || keyName==="в") this.move("right")
         if (keyName === " ") this.attack()
      })
   }
   init() {
      this.config()
      startGame()
   }
   config() {
      this.heroPower = 50
      this.heroHealth = 100
      this.popup.style.display = "none"
      this.gameMap = this.createMap(this.rows, this.columns)
      for (let i = 1; i <= 11; i++) {
         this[`${i}-enemyHealth`] = 100
      }
   }
   createMap() {
      const array = []
      for (let row = 0; row < game.rows; row++) {
         for (let column = 0; column < game.columns; column++) {
            array.push([column, row, "wall"])
         }
      }
      return array
   }
   move(direction) {
      if (moveHandler(direction)) {
         fight("enemy")
         moveHandler(this.enemyRandomMove,"enemy")
      }
   }
   attack() {
      fight()
      fight("enemy")
      moveHandler(this.enemyRandomMove, "enemy")
   }
}

function startGame() {
   spawn("roads")
   spawn("rooms")
   spawn("hero", 1)
   spawn("enemy",10)
   spawn("potion",10)
   spawn("sword",2)
   render()
}

function spawn(type,count) {
   let k = 1
   if (type==="roads") return createRoads()
   if (type==="rooms") return createRooms()
   while (k<count+1) {
      let num = game.columns * game.rows
      let randNum = randomNum(num, 0)
      if (game.gameMap[randNum][2]==="tile") {
         k++
         game.gameMap[randNum][2] = type
         if (type === "enemy") game.gameMap[randNum][3] = k
      }
   }
}

function fight(persone = "hero") {
   const pos = game.gameMap.filter((el) => el[2] === persone)
   pos.map(el => {
      game.direction.map(dir => {
         fightValidate(dir.where[0], dir.where[1], el, persone)
      })
   })
}

function render() {
   game.container.querySelectorAll(".tile")
      .forEach(el => el.parentNode.removeChild(el))
   game.gameMap.map(el => {
      const div = document.createElement("div")
      const divHealth = document.createElement("div")
      divHealth.classList.add("health")
      div.classList.add("tile")
      game.container.appendChild(div)
      switch (el[2]) {
         case ("wall"):
            div.classList.add("tileW")
            break;
         case ("hero"):
            div.appendChild(divHealth)
            div.classList.add("tileP")
            const tagHero = document.querySelector(".tileP")
            tagHero.firstChild.style.width = `${game["heroHealth"]}%`
            break;
         case ("sword"):
            div.classList.add("tileSW")
            break;
         case ("potion"):
            div.classList.add("tileHP")
            break;
         case ("enemy"):
            div.appendChild(divHealth)
            div.classList.add("tileE")
            div.dataset.enemy = `${el[3]}`
            const tagEnemy = document.querySelector(`[data-enemy = '${el[3]}']`)
            tagEnemy.firstChild.style.width = `${game[`${el[3]}-enemyHealth`]}%`
            break;
      }
   })
}

function moveHandler(type, persone = "hero") {
   const indexs = []
   let isGood = false
   game.direction.map(dir => {
      if (dir.direct===type) {
         game.col=dir.where[0]
         game.row=dir.where[1]
      }
   })
   const pos = game.gameMap.filter((el, i) => {
      if (el[2] === persone) {
         indexs.push(i)
         return true
      }
   })
   pos.map((el, i) => {
      if (moveValidate(game.col, game.row, el, indexs[i], persone)) isGood = true
   })
   return isGood
}

const game = new Game()
game.init()