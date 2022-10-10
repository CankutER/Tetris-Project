const board = document.querySelector(".board");
let start;
let prevTime;
let speed = 400;

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
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    speed = Math.max(50, speed - speed * 0.15);
  }
});
window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowDown") {
    speed = 400;
  }
});

// sync version

function play(time) {
  if (!start) {
    start = time;
    prevTime = start;
  }

  const delta = time - prevTime;

  if (delta >= speed) {
    game.draw();

    if (!game.ifCollides()) {
      game.update();
    } else {
      game.ifRemove();
    }

    prevTime = time;
  }
  window.requestAnimationFrame(play);
}

//

// async version

// async function play(time) {
//   if (!start) {
//     start = time;
//     prevTime = start;
//   }

//   const delta = time - prevTime;

//   if (delta >= 400) {
//     const step = await (async function () {
//       return new Promise((resolve) => {
//         setTimeout(() => {
//           game.draw();

//           if (!game.ifCollides()) {
//             game.update();
//           } else {
//             console.log("collide");
//             game.ifRemove();
//           }
//           prevTime = time;
//           resolve();
//         }, 0);
//       });
//     })();
//   }
//   window.requestAnimationFrame(play);
// }

//

//

class Board {
  totalRow = 20;
  totalCol = 10;
  constructor(element) {
    this.element = element;
    this.removeControl = false;
    this.namesOfShapes = ["line", "square", "Z", "L", "T"];
    this.possibleShapes = {
      line: [
        { row: 1, col: 4 },
        { row: 1, col: 5 },
        { row: 1, col: 6 },
        { row: 1, col: 7 },
      ],
      square: [
        { row: 1, col: 5 },
        { row: 1, col: 6 },
        { row: 2, col: 5 },
        { row: 2, col: 6 },
      ],
      Z: [
        { row: 1, col: 4 },
        { row: 1, col: 5 },
        { row: 2, col: 5 },
        { row: 2, col: 6 },
      ],
      L: [
        { row: 1, col: 4 },
        { row: 2, col: 4 },
        { row: 2, col: 5 },
        { row: 2, col: 6 },
      ],
      T: [
        { row: 1, col: 5 },
        { row: 2, col: 4 },
        { row: 2, col: 5 },
        { row: 2, col: 6 },
      ],
    };
    this.prevActiveShape = [];
    this.prevPlaced = [];
    this.beforeMoveDown = [];
    this.beforeMoveLateral = [];
    this.activeShape = [];
    this.chooseShape();
    this.placed = [];
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        const movedRight = this.activeShape.map((item) => {
          return { ...item, col: item.col + 1 };
        });
        if (
          movedRight.every(
            (item) =>
              item.col <= this.totalCol &&
              !document
                .getElementById(`${item.row}${item.col}`)
                .classList.contains("played")
          )
        ) {
          this.beforeMoveLateral = [...this.activeShape];
          this.activeShape = movedRight.map((item) => {
            return { ...item };
          });
          this.drawActiveShape(this.beforeMoveLateral);
        }
      }
      if (e.key === "ArrowLeft") {
        const movedLeft = this.activeShape.map((item) => {
          return { ...item, col: item.col - 1 };
        });
        if (
          movedLeft.every(
            (item) =>
              item.col > 0 &&
              !document
                .getElementById(`${item.row}${item.col}`)
                .classList.contains("played")
          )
        ) {
          this.beforeMoveLateral = [...this.activeShape];
          this.activeShape = movedLeft.map((item) => {
            return { ...item };
          });
          this.drawActiveShape(this.beforeMoveLateral);
        }
      }
    });
  }
  chooseShape() {
    const nextShapeId = Math.floor(Math.random() * this.namesOfShapes.length);
    this.activeShape = [
      ...this.possibleShapes[this.namesOfShapes[nextShapeId]],
    ].map((item) => {
      return { ...item };
    });
  }
  draw() {
    this.drawActiveShape(this.prevActiveShape);
    if (this.removeControl) {
      console.log("something removed");
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
      shape.classList.remove("playing");
      shape.classList.add("played");
    });
    this.removeControl = false;
  }

  drawActiveShape(previousStep) {
    if (previousStep === this.prevActiveShape) {
      this.prevActiveShape.forEach((piece) => {
        const shape = document.getElementById(`${piece.row}${piece.col}`);

        shape.classList.remove("playing");
      });
      this.activeShape.forEach((piece) => {
        const shape = document.getElementById(`${piece.row}${piece.col}`);

        shape.classList.add("playing");
      });
    } else {
      this.prevActiveShape.forEach((piece) => {
        const shape = document.getElementById(`${piece.row}${piece.col}`);

        shape.classList.remove("playing");
      });
      previousStep.forEach((piece) => {
        const shape = document.getElementById(`${piece.row}${piece.col}`);

        shape.classList.remove("playing");
      });
      this.activeShape.forEach((piece) => {
        const shape = document.getElementById(`${piece.row}${piece.col}`);

        shape.classList.add("playing");
      });
    }
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
      this.chooseShape();
    }
    return control;
  }
  ifRemove() {
    // find how many slots are filled in each row
    let rowStats = {};
    rowStats = this.placed.reduce((stats, curr) => {
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
    this.prevPlaced = this.placed.map((slot) => {
      return { ...slot };
    });
    for (const row in rowStats) {
      if (rowStats[row] === this.totalCol) {
        console.log("checking rowstats");
        console.log(rowStats[row]);

        this.removeControl = true;

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
    }
    //
  }
}

const game = new Board(board);

window.requestAnimationFrame(play);
