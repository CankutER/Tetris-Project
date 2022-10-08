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

  if (delta >= 400) {
    game.draw();
    if (!game.ifCollides()) {
      game.update();
    }
    game.ifRemove();
    prevTime = time;
  }
  window.requestAnimationFrame(play);
}

//

class Board {
  totalRow = 20;
  totalCol = 10;
  constructor(element) {
    this.element = element;
    this.removeControl = false;
    this.prevActiveShape = [];
    this.prevPlaced = [];
    this.beforeMoveDown = [];
    this.activeShape = [
      ...(function e() {
        const arr = new Array(10).fill({}).map((element, i) => {
          const temp = {};
          temp.row = 2;
          temp.col = i + 1;

          return temp;
        });

        return arr;
      })(),
      { row: 1, col: 5 },
    ];
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
    if (this.removeControl) {
      this.prevPlaced.forEach((piece) => {
        const shape = document.getElementById(`${piece.row}${piece.col}`);

        shape.classList.remove("played");
        shape.classList.remove("playing");
      });
      this.beforeMoveDown.forEach((piece) => {
        const shape = document.getElementById(`${piece.row}${piece.col}`);

        shape.classList.remove("played");
        shape.classList.remove("playing");
      });
    }
    this.placed.forEach((piece) => {
      const shape = document.getElementById(`${piece.row}${piece.col}`);
      shape.classList.add("played");
    });
  }
  update() {
    this.prevActiveShape = this.activeShape.map((item) => {
      return { ...item };
    });
    this.activeShape.forEach((piece) => {
      piece.row += 1;
    });

    // REDUNDANT OLD CODE

    // this.prevActiveShape = this.activeShape.map((item) => {
    //   return { ...item };
    // });
    // if (this.activeShape.every((item) => item.row < this.totalRow)) {
    //   this.activeShape.forEach((piece) => {
    //     piece.row += 1;
    //   });
    // } else {
    //   const temp = this.activeShape.map((item) => {
    //     return { ...item };
    //   });
    //   this.placed.push(...temp);
    //   this.activeShape = [{ row: 1, col: 5 }];
    // }

    //
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
      this.activeShape = [
        ...(function e() {
          const arr = new Array(10).fill({}).map((element, i) => {
            const temp = {};
            temp.row = 2;
            temp.col = i + 1;

            return temp;
          });

          return arr;
        })(),
        { row: 1, col: 5 },
      ];
    }
    return control;
  }
  ifRemove() {
    // find how many slots are filled in each row
    const rowStats = this.placed.reduce((stats, curr) => {
      if (stats[curr.row]) {
        stats[curr.row] += 1;
      } else {
        stats[curr.row] = 1;
      }
      return stats;
    }, {});
    //

    // mark rows to be removed
    this.removeControl = false;
    for (const row in rowStats) {
      if (rowStats[row] === this.totalCol) {
        this.removeControl = true;

        this.prevPlaced = this.placed.map((slot) => {
          return { ...slot };
        });

        this.placed.forEach((slot, i) => {
          if (slot.row == row) {
            this.placed[i] = "toBeRemoved";
          }
        });
      }
    }
    //

    // remove marked rows
    if (this.removeControl) {
      const filteredPlaced = this.placed.filter(
        (slot) => slot !== "toBeRemoved"
      );
      this.placed = filteredPlaced.map((item) => {
        return { ...item };
      });
    }
    //

    // finding which rows to be deleted
    const findRowsToDelete = () => {
      const tempSet = new Set();
      for (const row in rowStats) {
        if (rowStats[row] == this.totalCol) {
          tempSet.add(row);
        }
      }
      return tempSet;
    };

    const rowsToBeDeleted = findRowsToDelete();
    //

    // Moving down after removal
    this.beforeMoveDown = this.placed.map((item) => {
      return { ...item };
    });
    rowsToBeDeleted.forEach((row) => {
      this.beforeMoveDown.forEach((slot, i) => {
        if (slot.row < row) {
          if (this.placed[i]) {
            this.placed[i].row = Number(slot.row) + 1;
          }
        }
      });
    });
    //
  }
}

const game = new Board(board);

window.requestAnimationFrame(play);
