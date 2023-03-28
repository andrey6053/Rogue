class Game {
   init() {
      this.config()
      startGame()
   }
   config() {
      this.gameMap = this.createMap(rows, columns)
      this.enemyPower = 5
      this.heroHealth = 100
      this.heroPower = 20
      this.direction = ["right", "left", "top", "bottom"]
      this.right = [1, 0]
      this.top = [0, -1]
      this.left = [-1, 0]
      this.bottom = [0, 1]
      for (let i = 1; i < 11; i++) {
         this[`${i}-enemyHealth`] = 100
      }
   }
   createMap(rows, columns) {
      const array = []
      for (let row = 0; row < rows; row++) {
         for (let column = 0; column < columns; column++) {
            array.push([column, row, "wall"])
         }
      }
      return array
   }
   moveRight(isPopup) {
      if (!isPopup) return
      if (move("right")) {
         fight([this.right, this.top, this.left, this.bottom], "enemy")
         move(this.direction[randomNum(this.direction.length, 0)], "enemy")
      }
   }
   moveLeft(isPopup) {
      if (!isPopup) return
      if (move("left")) {
         fight([this.right, this.top, this.left, this.bottom], "enemy")
         move(this.direction[randomNum(this.direction.length, 0)], "enemy")
      }
   }
   moveTop(isPopup) {
      if (!isPopup) return
      if (move("top")) {
         fight([this.right, this.top, this.left, this.bottom], "enemy")
         move(this.direction[randomNum(this.direction.length, 0)], "enemy")
      }
   }
   moveBottom(isPopup) {
      if (!isPopup) return
      if (move("bottom")) {
         fight([this.right, this.top, this.left, this.bottom], "enemy")
         move(this.direction[randomNum(this.direction.length, 0)], "enemy")
      }
   }
   attack(isPopup) {
      if (!isPopup) return
      fight([this.right, this.top, this.left, this.bottom])
      fight([this.right, this.top, this.left, this.bottom], "enemy")
      move(this.direction[randomNum(this.direction.length, 0)], "enemy")
   }
}

const gameContainer = document.querySelector('.field')
const widthField = gameContainer.offsetWidth
const heightField = gameContainer.offsetHeight
const widthTile = 50
const heightTile = 50
const columns = widthField / widthTile
const rows = heightField / heightTile

function startGame() {
   const popup = document.querySelector(".popup")
   popup.style.display = "none"
   spawn(game.gameMap, "roads", columns, rows)
   spawn(game.gameMap, "rooms", columns, rows)
   spawn(game.gameMap, "hero", columns, rows)
   spawn(game.gameMap, "enemy", columns, rows)
   spawn(game.gameMap, "potion", columns, rows)
   spawn(game.gameMap, "sword", columns, rows)
   render(game.gameMap, gameContainer)
}

function fightValidate(col, row, posHero, type) {
   let index
   const posToAttack = game.gameMap.filter((el, i) => {
      if (el[0] === posHero[0] + col && el[1] === posHero[1] + row) {
         index = i
         return true
      }
   })
   if (posToAttack.length === 0 && type === "hero" || posToAttack.length === 0 && type === "enemy") return
   const pos = posToAttack[0][2]
   if (type === "hero" && pos === "enemy") {
      const dataSet = posToAttack[0][3]
      const tagEnemy = document.querySelector(`[data-enemy = '${dataSet}']`)
      game[`${dataSet}-enemyHealth`] -= game.heroPower
      if (game[`${dataSet}-enemyHealth`] <= 0) {
         game.gameMap[index][2] = "tile"
         game.gameMap[index].pop
         render(game.gameMap, gameContainer)
         const enemys = document.querySelectorAll(".tileE")
         if (enemys.length === 0) {
            const popup = document.querySelector(".popup")
            const titlePopup = document.querySelector(".popup__title")
            popup.style.display = "flex"
            titlePopup.textContent = "You Won!"
         }
         return
      }
      tagEnemy.firstChild.style.width = `${game[`${dataSet}-enemyHealth`]}%`
   }
   if (pos === "hero") {
      const tagHero = document.querySelector(".tileP")
      game["heroHealth"] -= game["enemyPower"]
      if (game["heroHealth"] <= 0) {
         game.gameMap[index][2] = "tile"
         game.gameMap[index].pop
         render(game.gameMap, gameContainer)
         const popup = document.querySelector(".popup")
         const titlePopup = document.querySelector(".popup__title")
         popup.style.display = "flex"
         titlePopup.textContent = "Game Over!"
         return
      }
      tagHero.firstChild.style.width = `${game["heroHealth"]}%`
   }
}

function fight(directions, persone = "hero") {
   const pos = game.gameMap.filter((el) => el[2] === persone)
   pos.map((el, i) => {
      directions.map(direct => {
         fightValidate(direct[0], direct[1], el, persone)
      })
   })
}

function spawn(gameMap, type, columns, rows) {
   let num = columns * rows
   let randNum = randomNum(num, 0)
   let i = 1
   switch (type) {
      case ("hero"):
         if (game.gameMap[randNum][2] === "tile") {
            game.gameMap[randNum][2] = type
         } else {
            spawn(game.gameMap, "hero", columns, rows)
         }
         break;
      case ("enemy"):
         while (i < 11) {
            if (game.gameMap[randNum][2] === "tile") {
               game.gameMap[randNum][2] = type
               game.gameMap[randNum][3] = i
               randNum = randomNum(num, 0)
               i++
            }
            randNum = randomNum(num, 0)
         }
         break;
      case ("potion"):
         while (i < 10) {
            if (game.gameMap[randNum][2] === "tile") {
               game.gameMap[randNum][2] = type
               randNum = randomNum(num, 0)
               i++
            }
            randNum = randomNum(num, 0)
         }
         break;
      case ("sword"):
         while (i < 3) {
            if (game.gameMap[randNum][2] === "tile") {
               game.gameMap[randNum][2] = type
               randNum = randomNum(num, 0)
               i++
            }
            randNum = randomNum(num, 0)
         }
         break;
      case ("roads"):
         const verticalRoad = randomNum(columns, 0, [])
         const gorizontRoad = randomNum(rows, 0, [])
         verticalRoad.map(el => {
            game.gameMap.map(elTile => {
               if (elTile[0] === el) {
                  elTile[2] = "tile"
               }
            })
         })
         gorizontRoad.map(el => {
            game.gameMap.map(elTile => {
               if (elTile[1] === el) {
                  elTile[2] = "tile"
               }
            })
         })
         break;
      case ("rooms"):
         const cols = []
         const rooms = []
         const height = randomNum(7, 4)
         const width = randomNum(7, 4)
         for (let i = 0; i < randomNum(6, 3); i++) {
            let randomCol = randomNum(columns - 5, 0)
            let randomRow = randomNum(rows - 2, 0)
            for (let i = 1; i < height; i++) {
               cols.push({ col: randomCol += 1, row: randomRow })
            }
         }
         cols.map(el => {
            for (let i = 1; i < width; i++) {
               rooms.push({ col: el.col, row: el.row += 1 })
            }
         })
         rooms.map(el => {
            game.gameMap.map(elem => {
               if (elem[0] === el.col && elem[1] === el.row) {
                  elem[2] = "tile"
               }
            })
         })
         break;
   }
}

function render(gameMap, container) {
   const childs = container.querySelectorAll(".tile")
      .forEach(el => el.parentNode.removeChild(el))
   game.gameMap.map(el => {
      const div = document.createElement("div")
      const divHealth = document.createElement("div")
      switch (el[2]) {
         case ("wall"):
            div.classList.add("tile", "tileW")
            break;
         case ("hero"):
            divHealth.classList.add("health")
            div.appendChild(divHealth)
            div.classList.add("tile", "tileP")
            container.appendChild(div)
            const tagHero = document.querySelector(".tileP")
            tagHero.firstChild.style.width = `${game["heroHealth"]}%`
            return;
         case ("tile"):
            div.classList.add("tile")
            break;
         case ("sword"):
            div.classList.add("tile", "tileSW")
            break;
         case ("potion"):
            div.classList.add("tile", "tileHP")
            break;
         case ("enemy"):
            divHealth.classList.add("health")
            div.appendChild(divHealth)
            div.classList.add("tile", "tileE")
            div.dataset.enemy = `${el[3]}`
            container.appendChild(div)
            const tagEnemy = document.querySelector(`[data-enemy = '${el[3]}']`)
            tagEnemy.firstChild.style.width = `${game[`${el[3]}-enemyHealth`]}%`
            return
      }
      container.appendChild(div)
   })
}

function moveValidate(col, row, posHero, ind, type) {
   let index
   const posToMove = game.gameMap.filter((el, i) => {
      if (el[0] === posHero[0] + col && el[1] === posHero[1] + row) {
         index = i
         return true
      }
   })
   if (posToMove.length === 0 && type === "hero") return console.log("Oops, you cannot move there")
   if (posToMove.length === 0 && type === "enemy") return
   const pos = posToMove[0][2]
   if (type === "enemy") {
      if (pos === "potion" || pos === "sword" || pos === "wall" || pos === "hero" || pos === "enemy") {
         return
      }
      game.gameMap[ind][2] = "tile"
      game.gameMap[index][2] = type
      const dataSet = game.gameMap[ind].pop()
      game.gameMap[index].push(dataSet)
      render(game.gameMap, gameContainer)
      return true
   }
   if (pos !== "tile" && pos !== "potion" && pos !== "sword") {
      return console.log("Oops, you cannot move there")
   }
   if (pos === "sword") {
      game["heroPower"] += 20
   }
   if (pos === "potion") {
      game["heroHealth"] + 20 > 100 ? game["heroHealth"] = 100 : game["heroHealth"] += 20
   }
   game.gameMap[ind][2] = "tile"
   game.gameMap[index][2] = type
   render(game.gameMap, gameContainer)
   return true
}

function move(type, persone = "hero") {
   const indexs = []
   let isGood = false
   const pos = game.gameMap.filter((el, i) => {
      if (el[2] === persone) {
         indexs.push(i)
         return true
      }
   })
   pos.map((el, i) => {
      switch (type) {
         case ("right"):
            if (moveValidate(game[type][0], game[type][1], el, indexs[i], persone)) isGood = true
            break;
         case ("left"):
            if (moveValidate(game[type][0], game[type][1], el, indexs[i], persone)) isGood = true

            break;
         case ("top"):
            if (moveValidate(game[type][0], game[type][1], el, indexs[i], persone)) isGood = true

            break;
         case ("bottom"):
            if (moveValidate(game[type][0], game[type][1], el, indexs[i], persone)) isGood = true

            break;
      }
   })
   return isGood
}

function randomNum(max, min, array) {
   if (!array) return Math.floor(Math.random() * (max - min) + min)
   const filteredArray = []
   while (filteredArray.length < randomNum(6, 3)) {
      let randNum = Math.floor(Math.random() * (max - min) + min)
      const rightNum = randNum + 1
      const leftNum = randNum - 1
      if (filteredArray.indexOf(randNum) === -1 && filteredArray.indexOf(rightNum) === -1 && filteredArray.indexOf(leftNum) === -1) {
         filteredArray.push(randNum)
      }
   }
   filteredArray.map(el => array.push(el))
   return array
}
//function render(this.gameMap, container) {
//   let html = ''
//   this.gameMap.map(el => {
//      switch (el[2]) {
//         case ("wall"):
//            html += `<div class='tile tileW'></div>`
//            break;
//         case ("hero"):
//            html += `
//            <div class='tile tileP'>
//               <div class='health'></div>
//            </div>`
//            break;
//         case ("tile"):
//            html += `<div class='tile'></div>`
//            break;
//         case ("sword"):
//            html += `<div class='tile tileSW'></div>`
//            break;
//         case ("potion"):
//            html += `<div class='tile tileHP'></div>`
//            break;
//         case ("enemy"):
//            html += `
//            <div class='tile tileE'>
//               <div class='health'></div>
//            </div>`
//            break;
//      }

//   })
//   container.innerHTML = html
//}