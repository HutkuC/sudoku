// Function to generate a random Sudoku grid
function generateSudoku() {
    let grid = Array(9).fill(0).map(() => Array(9).fill(0));
    fillGrid(grid);
    document.addEventListener('keydown', (e) => handleCellInput(e));
    return grid;
}

// Function to fill the grid with numbers
function fillGrid(grid) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] === 0) {
                let numbers = Array(9).fill(0).map((_, index) => index + 1);
                while (numbers.length > 0) {
                    let randomIndex = Math.floor(Math.random() * numbers.length);
                    let number = numbers.splice(randomIndex, 1)[0];
                    if (isValid(grid, i, j, number)) {
                        grid[i][j] = number;
                        if (fillGrid(grid)) {
                            return true;
                        }
                        grid[i][j] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// Function to check if a number is valid in a cell
function isValid(grid, row, col, number) {
    // Check the row
    for (let i = 0; i < 9; i++) {
        if (grid[row][i] === number) {
            return false;
        }
    }
    // Check the column
    for (let i = 0; i < 9; i++) {
        if (grid[i][col] === number) {
            return false;
        }
    }
    // Check the 3x3 box
    let boxRow = Math.floor(row / 3) * 3;
    let boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[boxRow + i][boxCol + j] === number) {
                return false;
            }
        }
    }
    return true;
}

function isGridValid(grid) {
    // Check every row
    for (let i = 0; i < 9; i++) {
        let bitmask = 0;
        for (let j = 0; j < 9; j++) {
            if(bitmask & (1 << grid[i][j]) && grid[i][j] !== 0) {
                return false;
            }
            bitmask |= 1 << grid[i][j];
        }
    }
    // Check every column
    for (let i = 0; i < 9; i++) {
        let bitmask = 0;
        for (let j = 0; j < 9; j++) {
            if(bitmask & (1 << grid[j][i]) && grid[j][i] !== 0) {
                return false;
            }
            bitmask |= 1 << grid[j][i];
        }
    }
    // Check every 3x3 box
    for (let i = 0; i < 9; i += 3) {
        for (let j = 0; j < 9; j += 3) {
            let bitmask = 0;
            for (let k = 0; k < 3; k++) {
                for (let l = 0; l < 3; l++) {
                    if(bitmask & (1 << grid[i + k][j + l]) && grid[i + k][j + l] !== 0) {
                        return false;
                    }
                    bitmask |= 1 << grid[i + k][j + l];
                }
            }
        }
    }
    return true;
}

// Function to create the Sudoku grid HTML
function createGrid(grid) {
    let sudokuGrid = document.querySelector('.sudoku-grid');
    sudokuGrid.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            if (grid[i][j] !== 0) {
                cell.textContent = grid[i][j];
                cell.classList.add('filled');
            }
            if (i % 3 === 0) {
                cell.style.borderTopWidth = '3px';
            }
            if (j % 3 === 0) {
                cell.style.borderLeftWidth = '3px';
            }
            if (i % 3 === 2) {
                cell.style.borderBottomWidth = '3px';
            }
            if (j % 3 === 2) {
                cell.style.borderRightWidth = '3px';
            }
            cell.addEventListener('click', () => {
                selectCell(cell);
            });
            sudokuGrid.appendChild(cell);
        }
    }
}

// Function to select a cell
function selectCell(cell) {
    let selectedCell = document.querySelector('.cell.selected');
    if (selectedCell) {
        selectedCell.classList.remove('selected');
    }
    cell.classList.add('selected');
}

// Function to handle cell input
function handleCellInput(e) {
    let cell = document.querySelector('.cell.selected');
    if (cell) {
        if (!cell.classList.contains('filled')) {   
            if (e.key === 'Backspace') {
                cell.textContent = '';
                cell.classList.remove('error');
            } else if (e.key >= '1' && e.key <= '9') {
                let number = parseInt(e.key);
                let row = Array.prototype.indexOf.call(cell.parentNode.children, cell) / 9 | 0;
                let col = Array.prototype.indexOf.call(cell.parentNode.children, cell) % 9;
                let grid = getGrid();
                if (isValid(grid, row, col, number)) {
                    cell.textContent = number;
                    cell.classList.remove('error');
                    grid = getGrid();
                    if (isGridFull(grid) && isGridValid(grid)) {
                        let popup = document.querySelector('.popup');
                        popup.style.display = 'block';
                        popup.querySelector('button').addEventListener('click', () => {
                            popup.style.display = 'none';
                            startGame();
                        });
                    }
                } else {
                    cell.textContent = number;
                    cell.classList.add('error');
                }
            }
        }
    }
    if(isGridValid(getGrid())) {
        document.querySelectorAll('.cell.error').forEach(cell => {
            cell.classList.remove('error');
        });
    }
}

// Function to get the current state of the grid
function getGrid() {
    let grid = Array(9).fill(0).map(() => Array(9).fill(0));
    let cells = document.querySelectorAll('.cell');
    for (let i = 0; i < cells.length; i++) {
        let row = i / 9 | 0;
        let col = i % 9;
        if (cells[i].textContent !== '') {
            grid[row][col] = parseInt(cells[i].textContent);
        }
    }
    return grid;
}

// Function to check if the grid is full
function isGridFull(grid) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] === 0) {
                return false;
            }
        }
    }
    return true;
}

// Function to start the game
function startGame() {
    let grid = generateSudoku();
    for (let i = 0; i < 50; i++) {
        let randomRow = Math.floor(Math.random() * 9);
        let randomCol = Math.floor(Math.random() * 9);
        grid[randomRow][randomCol] = 0;
    }
    createGrid(grid);
    let restartButton = document.querySelector('.restart-button');
    restartButton.addEventListener('click', () => {
        startGame();
    });
}

startGame();
