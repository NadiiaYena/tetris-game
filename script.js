const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
let playfield;
let cells;
let score;

const TETROMINO_NAMES = ["O", "L", "J", "I", "T"];

const TETROMINOES = {
  O: [
    [1, 1],
    [1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  T: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
  ],
  I: [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  J: [
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
};
let tetromino = {
  name: "",
  matrix: [],
  column: 0,
  row: 0,
};

function randomFigure(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function generateTetromino() {
  console.log("generateTetromino");
  const nameTetro = randomFigure(TETROMINO_NAMES);
  const matrix = TETROMINOES[nameTetro];
  const column = Math.floor(PLAYFIELD_COLUMNS / 2 - matrix.length / 2);
  const row = -2;

  tetromino = {
    name: nameTetro,
    matrix: matrix,
    column: column,
    row: row,
  };
}

function convertPositionToIndex(row, col) {
  console.log("convertPositionToIndex");
  return row * PLAYFIELD_COLUMNS + col;
}

function generatePlayfield() {
  console.log("generatePlayfield");
  for (let i = 0; i < PLAYFIELD_COLUMNS * PLAYFIELD_ROWS; i++) {
    const div = document.createElement("div");
    document.querySelector(".tetris").append(div);
  }

  playfield = new Array(PLAYFIELD_ROWS)
    .fill()
    .map(() => new Array(PLAYFIELD_COLUMNS).fill(0));
  console.table(playfield);
}

// keydown

document.addEventListener("keydown", onKeyDown);

function onKeyDown(event) {
  console.log(event);
  if (event.key == "ArrowLeft") {
    movetetrominoLeft();
  }
  if (event.key == "ArrowRight") {
    movetetrominoRight();
  }
  if (event.key == "ArrowDown") {
    movetetrominoDown();
  }
  if (event.key == "ArrowUp") {
    rotate();
  }

  draw();
}

function draw() {
  cells.forEach((el) => el.removeAttribute("class"));
  drawPlayField();
  drawTetromino();
}

function init(){
    generatePlayfield();

    cells = document.querySelectorAll(".tetris div");
    generateTetromino();
    moveDown()
    // draw()
    
}


// rotate

// let showRotated = [   // для прикладу як обертається фігура
//   [1, 2, 3],
//   [4, 5, 6],
//   [7, 8, 9],
// ];

function rotate() {
  rotateTetramino();
  draw();
}

function rotateTetramino() {
  const oldMatrix = tetromino.matrix;
  const rotatedMatrix = rotateMatrix(tetromino.matrix);
  //   showRotated = rotateMatrix(showRotated);

  tetromino.matrix = rotatedMatrix;
  if (!isValid()) {
    tetromino.matrix = oldMatrix;
  }
}

function rotateMatrix(matrixTetramino) {
  const n = matrixTetramino.length;
  const rotateMatrix = [];

  for (let i = 0; i < n; i++) {
    rotateMatrix[i] = [];
    for (let j = 0; j < n; j++) {
      rotateMatrix[i][j] = matrixTetramino[n - j - 1][i];
    }
  }
  return rotateMatrix;
}
// collisions

function isValid() {
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (isOutsideGameboard(row, column)) {
        return false;
      }
      if (hasCollisions(row, column)) {
        return false;
      }
    }
  }
  return true;
}

function isOutsideOfTopGameboard(row){
    return tetromino.row + row < 0
}

function isOutsideGameboard(row, column) {
  // return column < 0 ||
  // column > PLAYFIELD_COLUMNS - tetromino.matrix.length ||
  // row > PLAYFIELD_ROWS - tetromino.matrix.length;
  return (
    tetromino.matrix[row][column] &&
    (tetromino.row + row >= PLAYFIELD_ROWS ||
      tetromino.column + column < 0 ||
      tetromino.column + column >= PLAYFIELD_COLUMNS)
  );
}

function hasCollisions(row, column) {
  return (
    tetromino.matrix[row][column] &&
    playfield[tetromino.row + row]?.[tetromino.column + column]
  );
}

function movetetrominoDown() {
  tetromino.row += 1;
  if (!isValid()) {
    tetromino.row -= 1;
    placeTetramino();
  }
}
function movetetrominoLeft() {
  tetromino.column -= 1;
  if (!isValid()) {
    tetromino.column += 1;
  }
}
function movetetrominoRight() {
  tetromino.column += 1;
  if (!isValid()) {
    tetromino.column -= 1;
  }
}

// DRAW
function drawPlayField() {
  console.log("drawPlayField");
  //   playfield[4][3] = "O";
  // const name = tetromino.name;
  // const tetrominoMatrixSize = tetromino.matrix.length;
  for (let row = 0; row < PLAYFIELD_ROWS; row++) {
    for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
      if (!playfield[row][column]) continue;
      //   const nameFigure = tetromino.name
      const nameFigure = playfield[row][column];

      const cellIndex = convertPositionToIndex(row, column);
      console.log(cells[cellIndex]);
      cells[cellIndex].classList.add(nameFigure);
    }
  }
}

function drawTetromino() {
  console.log("drawTetromino");
  const name = tetromino.name;
  const tetrominiMatrixSize = tetromino.matrix.length;

  for (let row = 0; row < tetrominiMatrixSize; row++) {
    for (let column = 0; column < tetrominiMatrixSize; column++) {
      const cellIndex = convertPositionToIndex(
        tetromino.row + row,
        tetromino.column + column
      );
      if(isOutsideOfTopGameboard(row)){
        continue
      }
      //   cells[cellIndex].innerHTML = showRotated[row][column]; // add number
      if (!tetromino.matrix[row][column]) {
        continue;
      }
      cells[cellIndex].classList.add(name);
    }
  }
}

function placeTetramino() {
  const tetrominiMatrixSize = tetromino.matrix.length;

  for (let row = 0; row < tetrominiMatrixSize; row++) {
    for (let column = 0; column < tetrominiMatrixSize; column++) {
      if (tetromino.matrix[row][column]) {
        playfield[tetromino.row + row][tetromino.column + column] =
          tetromino.name;
      }
    }
  }
  console.log("playfield", playfield);
  generateTetromino();
}

function moveDown(){
    movetetrominoDown();
    draw();
    startLoop()
}
function startLoop(){
    setTimeout( ()=> requestAnimationFrame(moveDown), 700 )
}

startLoop()

init()
// console.log(tetromino);
//додати функцію котра буде повертати випадкову фігуру
// центрувати фігуру незалежно від ширини поля
//
