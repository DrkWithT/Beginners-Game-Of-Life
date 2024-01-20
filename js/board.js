/**
 * @file board.js
 * @note Requires Doxygen extension for fancy comments. Each of these comments in VSCode act like documentation.
 * @author Beginner's WS Team at CSULA ACM
 */

/**
 * @constant
 * @description Minimum allowed length of side in cells.
 * @type {number}
 */
const MIN_BOARD_SIDE_LENGTH = 16;

/**
 * @description Wraps an N^2 sized array to hold all cell data for Game Of Life.
 */
class Board {
    /** @type {number[][]} */
    cells

    /** @type {number} */
    sideLength

    /**
     * @description Creates and initializes a Board object. Arguments are checked.
     * @param {number} sideLength See `MIN_BOARD_SIDE_LENGTH` for more details.
     */
    constructor(sideLength) {
        if (!sideLength || sideLength < MIN_BOARD_SIDE_LENGTH) {
            throw new Error(`Board: Invalid side length ${sideLength}`);
        }

        // Initialize board variables before use.
        const cellCount = this.sideLength * this.sideLength;
        this.sideLength = sideLength;
        this.cells = new Array(cellCount);

        // Fill N * N cells in the N by N board with empty value.
        this.cells.fill(0, 0, cellCount);
    }

    getCellAt(row, col) {
        const index = this.sideLength * row + col;

        if (index < 0 || index >= this.sideLength * this.sideLength) {
            throw new Error(`Board.getCellAt(): Invalid index ${index}`);
        }

        return this.cells[index];
    }

    setCellAt(row, col, cellValue) {
        const index = this.sideLength * row + col;

        if (index < 0 || index >= this.sideLength * this.sideLength) {
            throw new Error(`Board.getCellAt(): Invalid index ${index}`);
        }

        this.cells[index] = cellValue;
    }

    /**
     * @description Helper method before the board is used within the Game Of Life simulation: loads preset of 1st cell generation.
     * @param {{row: number, col: number}[]} presetData Holds locations to place living cells at before simulation.
     */
    loadPreset(presetData) {
        presetData.forEach((locationPair, index) => {
            /*
                Because the board's data is actually a 1-D array, we need to do math for accessing the right spots. N * N sized array representing a N by N means that we need (row * N + col) as the index. `row` and `col` should be at most N.
            */
            const realIndex = locationPair.row * this.sideLength + locationPair.col;

            this.cells[realIndex] = 1;
        }, this);
    }

    clearAllCells() {
        this.cells.fill(0, 0, this.sideLength * this.sideLength);
    }
}
