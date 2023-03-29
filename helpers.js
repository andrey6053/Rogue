function randomNum(max, min, array) {
  if (!array) return Math.floor(Math.random() * (max - min) + min);
  const filteredArray = [];
  while (filteredArray.length < randomNum(6, 3)) {
    let randNum = Math.floor(Math.random() * (max - min) + min);
    const rightNum = randNum + 1;
    const leftNum = randNum - 1;
    if (
      filteredArray.indexOf(randNum) === -1 &&
      filteredArray.indexOf(rightNum) === -1 &&
      filteredArray.indexOf(leftNum) === -1
    ) {
      filteredArray.push(randNum);
    }
  }
  filteredArray.map((el) => array.push(el));
  return array;
}

function gameOver(title) {
  const titlePopup = document.querySelector(".popup__title");
  game.popup.style.display = "flex";
  titlePopup.textContent = title;
}

function kill(index) {
  game.gameMap[index][2] = "tile";
  game.gameMap[index].pop;
  render();
}

function moveValidate(col, row, posHero, ind, type) {
  let index;
  const posToMove = game.gameMap.filter((el, i) => {
    if (el[0] === posHero[0] + col && el[1] === posHero[1] + row) {
      index = i;
      return true;
    }
  });
  if (posToMove.length === 0) return;
  const pos = posToMove[0][2];
  if (type === "enemy") {
    if (pos !== "tile") return;
    game.gameMap[ind][2] = "tile";
    game.gameMap[index][2] = type;
    const dataSet = game.gameMap[ind].pop();
    game.gameMap[index].push(dataSet);
    render();
    return true;
  }
  if (pos === "wall" || pos === "enemy") return;
  if (pos === "sword") {
    game["heroPower"] += 20;
  }
  if (pos === "potion") {
    game["heroHealth"] + 20 > 100
      ? (game["heroHealth"] = 100)
      : (game["heroHealth"] += 20);
  }
  game.gameMap[ind][2] = "tile";
  game.gameMap[index][2] = type;
  render();
  return true;
}

function createRooms() {
  const cols = [];
  const rooms = [];
  const height = randomNum(7, 4);
  const width = randomNum(7, 4);
  for (let i = 0; i < randomNum(6, 3); i++) {
    let randomCol = randomNum(game.columns - 5, 0);
    let randomRow = randomNum(game.rows - 2, 0);
    for (let i = 1; i < height; i++) {
      cols.push({ col: (randomCol += 1), row: randomRow });
    }
  }
  cols.map((el) => {
    for (let i = 1; i < width; i++) {
      rooms.push({ col: el.col, row: (el.row += 1) });
    }
  });
  rooms.map((el) => {
    game.gameMap.map((elem) => {
      if (elem[0] === el.col && elem[1] === el.row) {
        elem[2] = "tile";
      }
    });
  });
}

function createRoads() {
  const randomCol = randomNum(game.columns, 0, []);
  const randomRow = randomNum(game.rows, 0, []);
  randomCol.map((el) => {
    game.gameMap.map((elTile) => {
      if (elTile[0] === el) {
        elTile[2] = "tile";
      }
    });
  });
  randomRow.map((el) => {
    game.gameMap.map((elTile) => {
      if (elTile[1] === el) {
        elTile[2] = "tile";
      }
    });
  });
}

function fightValidate(vertical, gorizont, posHero, type) {
  let index;
  const posToAttack = game.gameMap.filter((el, i) => {
    if (el[0] === posHero[0] + vertical && el[1] === posHero[1] + gorizont) {
      index = i;
      return true;
    }
  });
  if (posToAttack.length === 0) return;
  const pos = posToAttack[0][2];
  if (type === "hero" && pos === "enemy") {
    const dataSet = posToAttack[0][3];
    const tagEnemy = document.querySelector(`[data-enemy = '${dataSet}']`);
    game[`${dataSet}-enemyHealth`] -= game.heroPower;
    if (game[`${dataSet}-enemyHealth`] <= 0) {
      kill(index);
      if (document.querySelectorAll(".tileE").length === 0)
        gameOver("You Won!");
      return;
    }
    tagEnemy.firstChild.style.width = `${game[`${dataSet}-enemyHealth`]}%`;
  }
  if (pos === "hero") {
    const tagHero = document.querySelector(".tileP");
    game["heroHealth"] -= game["enemyPower"];
    if (game["heroHealth"] <= 0) {
      kill(index);
      gameOver("Game Over!");
      return;
    }
    tagHero.firstChild.style.width = `${game["heroHealth"]}%`;
  }
}
