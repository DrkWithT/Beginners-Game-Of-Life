/**
 * @file main.js
 * @description Contains simulation logic.
 */

(function() {
    const startButton = document.getElementById('start-btn');
    const resetButton = document.getElementById('reset-btn');
    const simCanvas = document.querySelector('canvas');
    const simDrawer = simCanvas.getContext('2d');
    
    const CANVAS_SIDE_PX = simCanvas.width;
    const CELL_SIDE_PX = 24;
    const CELL_SIDE_COUNT = CANVAS_SIDE_PX / CELL_SIDE_PX;
    const simBoard = new Board(CELL_SIDE_COUNT);

    let simRunning = false;

    const countNeighbors = (row, col) => {
        let count = 0;

        /// 1. Count top 3 neighbors...
        count += simBoard.getCellAt(row - 1, col - 1) || 0;
        count += simBoard.getCellAt(row - 1, col) || 0;
        count += simBoard.getCellAt(row - 1, col + 1) || 0;

        /// 2. Count left and right neighbors...
        count += simBoard.getCellAt(row, col - 1) || 0;
        count += simBoard.getCellAt(row, col + 1) || 0;

        /// 3. Count bottom 3 neighbors...
        count += simBoard.getCellAt(row + 1, col - 1) || 0;
        count += simBoard.getCellAt(row + 1, col) || 0;
        count += simBoard.getCellAt(row + 1, col + 1) || 0;

        return count;
    };

    const drawBoard = () => {
        let drawY = 0;
        let drawX = 0;

        simDrawer.fillStyle = 'gray';
        simDrawer.fillRect(0, 0, CANVAS_SIDE_PX, CANVAS_SIDE_PX);
        simDrawer.fillStyle = 'yellow';

        for (let row = 0; row < CELL_SIDE_COUNT; row++) {
            for (let col = 0; col < CELL_SIDE_COUNT; col++) {
                drawY = row * CELL_SIDE_PX;
                drawX = col * CELL_SIDE_PX;

                if (simBoard.getCellAt(row, col) === 1) {
                    simDrawer.fillRect(drawX, drawY, CELL_SIDE_PX, CELL_SIDE_PX);
                }
            }
        }

        if (simRunning) {
            setTimeout(() => {
                updateBoard();
            }, 500);
        }
    }

    const updateBoard = () => {
        let tempCell = null;
        let tempNeighbors = 0;

        for (let row = 0; row < CELL_SIDE_COUNT; row++) {
            for (let col = 0; col < CELL_SIDE_COUNT; col++) {
                tempCell = simBoard.getCellAt(row, col) || 0;
                tempNeighbors = countNeighbors(row, col);

                /// Handle cells at board edges.
                if (row === 0 || row === CELL_SIDE_COUNT - 1 || col === 0 || col === CELL_SIDE_COUNT - 1) {
                    /// Spawn cells at edge for fun.
                    simBoard.setCellAt(row, col, 0);
                } else if (tempCell === 0 && tempNeighbors === 3) {
                    /// Spawn a cell by 3 living neighbors.
                    simBoard.setCellAt(row, col, 1);
                } else if (tempCell === 1 && (tempNeighbors < 2 || tempNeighbors > 3)) {
                    /// A living cell dies on underpopulation or overpopulation.
                    simBoard.setCellAt(row, col, 0);
                } else if (tempCell === 1 && (tempNeighbors === 2 || tempNeighbors === 3)) {
                    /// A living cell survives if 2 or 3 neighbors.
                    simBoard.setCellAt(row, col, 1);
                } else {
                    // do nothing
                }
            }
        }

        if (simRunning) {
            setTimeout(() => {
                drawBoard();
            }, 500);
        }
    }

    const placeCellOnBoard = (event) => {
        if (simRunning) {
            event.preventDefault();
            return;
        }

        const targetRow = Math.floor(event.offsetY / CELL_SIDE_PX);
        const targetCol = Math.floor(event.offsetX / CELL_SIDE_PX);

        const newCellState = (simBoard.getCellAt(targetRow, targetCol) === 1)
            ? 0 : 1; // flip (toggle) cell life state

        simBoard.setCellAt(targetRow, targetCol, newCellState);
    };

    const startSimulation = () => {
        /// Prevent extra start of simulation which will mess up its rate.
        if (simRunning) {
            return;
        }

        simRunning = true;
        drawBoard();
    };

    const resetSimulation = () => {
        /// Prevent extra reset of simulation, and only stop & reset a running one.
        if (!simRunning) {
            return;
        }

        simRunning = false;
        simBoard.clearAllCells();
        drawBoard();
    };

    startButton.addEventListener('click', (event) => {
        startSimulation();
    });

    resetButton.addEventListener('click', (event) => {
        resetSimulation();
    });

    simCanvas.addEventListener('click', (event) => {
        placeCellOnBoard(event);
        drawBoard();
    });
})();
