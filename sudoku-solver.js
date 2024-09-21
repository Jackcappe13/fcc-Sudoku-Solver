class SudokuSolver {
  checkRowPlacement(puzzleString, row, column, value) {
    // Verifica che il valore sia valido
    if (value < 1 || value > 9) {
      return false;
    }

    // Converte la stringa in una griglia 2D
    const board = this.stringToBoard(puzzleString);

    // Controlla se il valore è già presente nella stessa riga
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === value) {
        return false;
      }
    }

    // Se il valore non è presente nella riga, è possibile posizionarlo
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    // Verifica che il valore sia valido
    if (value < 1 || value > 9) {
      return false;
    }

    // Converte la stringa in una griglia 2D
    const board = this.stringToBoard(puzzleString);

    // Controlla se il valore è già presente nella stessa colonna
    for (let r = 0; r < 9; r++) {
      if (board[r][column] === value) {
        return false;
      }
    }

    // Se il valore non è presente nella colonna, è possibile posizionarlo
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    // Verifica che il valore sia valido
    if (value < 1 || value > 9) {
      return false;
    }

    // Converte la stringa in una griglia 2D
    const board = this.stringToBoard(puzzleString);

    // Trova l'inizio della regione 3x3
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;

    // Controlla se il valore è già presente nella regione 3x3
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (board[r][c] === value) {
          return false;
        }
      }
    }

    // Se il valore non è presente nella regione 3x3, è possibile posizionarlo
    return true;
  }
  stringToBoard(sudokuString) {
    const cleanString = sudokuString.replace(/\s+/g, "");

    if (cleanString.length !== 81) {
      throw new Error("Expected puzzle to be 81 characters long");
    }

    if (/[^1-9.]/g.test(cleanString)) {
      throw new Error("Invalid characters in puzzle");
    }

    const board = [];
    for (let i = 0; i < 9; i++) {
      board.push([]);
      for (let j = 0; j < 9; j++) {
        const char = cleanString[i * 9 + j];
        board[i][j] = char === "." ? 0 : parseInt(char);
      }
    }
    return board;
  }

  solveSudoku(board) {
    if (this.solve(board)) {
      return board;
    } else {
      throw new Error("Puzzle cannot be solved");
    }
  }

  solve(board) {
    const emptySpot = this.findEmptySpot(board);
    if (!emptySpot) return true;

    const [row, col] = emptySpot;
    for (let num = 1; num <= 9; num++) {
      if (this.isValid(board, row, col, num)) {
        board[row][col] = num;
        if (this.solve(board)) return true;
        board[row][col] = 0;
      }
    }
    return false;
  }

  findEmptySpot(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          return [row, col];
        }
      }
    }
    return null;
  }

  isValid(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num) return false;
    }

    for (let x = 0; x < 9; x++) {
      if (board[x][col] === num) return false;
    }

    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (board[r][c] === num) return false;
      }
    }

    return true;
  }

  completeSudoku(sudokuString) {
    const board = this.stringToBoard(sudokuString);
    if (this.solveSudoku(board)) {
      return board
        .flat()
        .map((num) => (num === 0 ? "." : num))
        .join("");
    } else {
      throw new Error("Puzzle cannot be solved");
    }
  }
}

module.exports = SudokuSolver;
