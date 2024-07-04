const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
let playfield;
let cells;
let score;
let isPaused = false;
let timeId;
let isGameOver = false;
let overlay = document.querySelector('.overlay');
let btnRestart = document.querySelector('.btn-restart')
let scoreElement = document.querySelector('.score')
const arrowMobile = document.querySelector('.arrow-mobile')
console.log(arrowMobile)
const TETROMINO_NAMES = ["O", "L", "J", "I", "T", "S", "P", "K"];
//==== 
// Отримання інформації про користувача
const userAgent = navigator.userAgent;
const platform = navigator.platform;
const appVersion = navigator.appVersion;
const appName = navigator.appName;
const vendor = navigator.vendor;

// Виведення інформації в консоль
console.log('User Agent:', userAgent);
console.log('Platform:', platform);
console.log('App Version:', appVersion);
console.log('App Name:', appName);
console.log('Vendor:', vendor);

function getDeviceType() {
    const ua = navigator.userAgent;
    
    if (/mobile/i.test(ua)) {
        return 'Mobile';
    } else if (/tablet/i.test(ua)) {
        return 'Tablet';
    } else {
        return 'Desktop';
    }
}

// Використання функції для визначення типу пристрою
const deviceType = getDeviceType();
if(deviceType == 'Mobile'){
 document.querySelector('.arrow-mobile').style.display = 'flex'
}
console.log('Device Type:', deviceType);
//=====

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
    [0, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
  S: [
    [0, 1, 1],
    [0, 1, 0],
    [1, 1, 0],
  ],
  P: [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ],
 K: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],

 ]
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
//   console.log("convertPositionToIndex");
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
//   console.table(playfield);
}

// keyboards and clicks

document.addEventListener("keydown", onKeyDown);

btnRestart.addEventListener('click', ()=>{
    document.querySelector('.tetris').innerHTML = '';
    overlay.style.display = 'none';

    init();
})

arrowMobile.addEventListener('click', (e) =>{
    console.log(e.target)
    onKeyDown(e.target)
})

function onKeyDown(event) {
  console.log(event.textContent);

  if (event.key == "Escape" || event.textContent == "Pause") {
    togglePaused();
  }
if(!isPaused){
    // if (event.key == "Enter") {
    //     dropTetraminoDown();
    //   }
    if (event.key == "ArrowLeft" || event.textContent == "Arrow left") {
        movetetrominoLeft();
      }
      if (event.key == "ArrowRight"|| event.textContent == "Arrow right") {
        movetetrominoRight();
      }
      if (event.key == "ArrowDown"|| event.textContent == "Arrow down") {
        movetetrominoDown();
      }
      if (event.key == "ArrowUp"|| event.textContent == "Arrow up") {
        rotate();
      }
      
}

  draw();
}

function draw() {  // малюємо поле і фігуру
  cells.forEach((el) => el.removeAttribute("class"));
  drawPlayField();
  drawTetromino();
}

function dropTetraminoDown(){
    console.log('dropTetraminoDown')
    while(isValid){
        tetromino.row++;
    }
    tetromino.row--;
}

function togglePaused(){
    isPaused = !isPaused;
    if(isPaused){
        stopLoop()
    } else{
        startLoop()
    }
}

function init(){
    score = 0;
    scoreElement.innerHTML = 0
    isGameOver = false;
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
//   console.log("drawPlayField");
  //   playfield[4][3] = "O";
  // const name = tetromino.name;
  // const tetrominoMatrixSize = tetromino.matrix.length;
  for (let row = 0; row < PLAYFIELD_ROWS; row++) {
    for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
      if (!playfield[row][column]) continue;
      //   const nameFigure = tetromino.name
      const nameFigure = playfield[row][column];

      const cellIndex = convertPositionToIndex(row, column);
    //   console.log(cells[cellIndex]);
      cells[cellIndex].classList.add(nameFigure);
    }
  }
}

function drawTetromino() {
//   console.log("drawTetromino");
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
function countScore(destroyRows){
    if(destroyRows == 1){
        score +=10
    }
    if(destroyRows == 2){
        score +=30
    }
    if(destroyRows == 3){
        score +=60
    }
    if(destroyRows == 4){
        score +=100
    }
    scoreElement.innerHTML = score;
}


function placeTetramino() {
  const tetrominiMatrixSize = tetromino.matrix.length;

  for (let row = 0; row < tetrominiMatrixSize; row++) {
    for (let column = 0; column < tetrominiMatrixSize; column++) {
        if(isOutsideOfTopGameboard(row)){
            console.log('isOutsideGameboard')
            isGameOver = true;
            overlay.style.display = 'flex'
            return
        }
      if (tetromino.matrix[row][column]) {
        playfield[tetromino.row + row][tetromino.column + column] =
          tetromino.name;
      }
    }
  }
//   console.log("playfield", playfield);
    let filledRow = findFilledRows();
    removeFillRow(filledRow);
    countScore(filledRow.length);
  generateTetromino();
}

function findFilledRows(){
    const fillRows = [];
    for(let row = 0; row < PLAYFIELD_ROWS; row++){
        let filledColumns = 0;
        for(let column = 0; column < PLAYFIELD_COLUMNS; column++){
            if(playfield[row][column] != 0){
                filledColumns++;
            }
        }
        if(PLAYFIELD_COLUMNS == filledColumns){
            fillRows.push(row)
        }
    }
 return fillRows;
}

function removeFillRow(filledRow){
    for(let i = 0; i < filledRow.length; i++){
        const row = filledRow[i]
        dropRowsAbove(row)
    }

}

function dropRowsAbove(rowDelete){
    for(let row = rowDelete; row > 0; row--){
        playfield[row] = playfield[row-1]

    }
    playfield[0] = new Array(PLAYFIELD_COLUMNS).fill(0);

}




function moveDown(){
    movetetrominoDown();
    draw();
    stopLoop()
    startLoop()
}

function startLoop(){
    timeId = setTimeout( ()=> requestAnimationFrame(moveDown), 700 )
}

function stopLoop(){
    clearTimeout(timeId);
    timeId = null;
}

startLoop()

init()
