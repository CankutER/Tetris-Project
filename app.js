const board = document.querySelector(".board");
let start;
let prevTime;

// CREATE BOARD
for (let i = 1; i <= 20; i++) {
  for (let j = 1; j <= 10; j++) {
    const slot = document.createElement("div");
    slot.setAttribute("id", `${i}${j}`);
    slot.classList.add("slot");
    board.appendChild(slot);
  }
}
//

// CONTINOUS UPDATE LOGIC
function play(time) {
  if (!start) {
    start = time;
    prevTime = start;
  }

  const delta = time - prevTime;

  if (delta >= 500) {
    game.draw();
    if (!game.ifCollides()) {
      game.update();
    }
    prevTime = time;
  }
  window.requestAnimationFrame(play);
}

window.requestAnimationFrame(play);

//

class Board {
  totalRow = 20;
  totalCol = 10;
  constructor(element) {
    this.element = element;
    this.prevActiveShape = [];
    this.activeShape = [{ row: 1, col: 5 }];
    this.placed = [];
  }
  draw() {
    this.prevActiveShape.forEach((piece) => {
      const shape = document.getElementById(`${piece.row}${piece.col}`);

      shape.classList.remove("playing");
    });
    this.activeShape.forEach((piece) => {
      const shape = document.getElementById(`${piece.row}${piece.col}`);

      shape.classList.add("playing");
    });
    this.placed.forEach((piece) => {
      const shape = document.getElementById(`${piece.row}${piece.col}`);
      shape.classList.add("played");
    });
  }
  update() {
    this.prevActiveShape = this.activeShape.map((item) => {
      return { ...item };
    });
    if (this.activeShape.every((item) => item.row < this.totalRow)) {
      this.activeShape.forEach((piece) => {
        piece.row += 1;
      });
    } else {
      const temp = this.activeShape.map((item) => {
        return { ...item };
      });
      this.placed.push(...temp);
      this.activeShape = [{ row: 1, col: 5 }];
    }
  }
  ifCollides() {
    let control = false;
    this.activeShape.forEach((element) => {
      const slotBelow = document.getElementById(
        `${element.row + 1}${element.col}`
      );
      if (
        this.activeShape.every((item) => item.row < this.totalRow)
          ? slotBelow.classList.contains("played")
          : true
      ) {
        control = true;
      }
    });
    if (control) {
      const temp = this.activeShape.map((item) => {
        return { ...item };
      });
      this.placed.push(...temp);
      this.activeShape = [{ row: 1, col: 5 }];
    }
    return control;
  }
}

const game = new Board(board);
