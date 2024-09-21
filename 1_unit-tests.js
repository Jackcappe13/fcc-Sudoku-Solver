const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("Unit Tests", () => {
  test("Logic handles a valid puzzle string of 81 characters", (done) => {
    const puzzle =
      "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    const board = solver.stringToBoard(puzzle);

    // Check if board is an array
    assert.isArray(board, "Board should be an array");
    assert.lengthOf(board, 9, "Board should have 9 rows");
    board.forEach((row) => {
      assert.isArray(row, "Each row should be an array");
      assert.lengthOf(row, 9, "Each row should have 9 columns");
    });

    done();
  });

  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", (done) => {
    const puzzle =
      "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2...A...4..8916..85.72...3";
    assert.throws(
      () => solver.stringToBoard(puzzle),
      /Invalid characters in puzzle/
    );

    // Assuming that invalid characters will not be converted to a valid board
    assert.throws(
      () => solver.checkRowPlacement(puzzle, 0, 0, 1),
      /Invalid characters in puzzle/
    );
    assert.isTrue(true);
    done();
  });

  test("Logic handles a puzzle string that is not 81 characters in length", (done) => {
    const puzzle =
      "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3...123";
    assert.throws(
      () => solver.stringToBoard(puzzle),
      /Expected puzzle to be 81 characters long/
    );
    assert.isTrue(true);
    done();
  });

  test("Logic handles a valid row placement", (done) => {
    const puzzle =
      "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    const row = 0;
    const column = 2;
    const value = 6;

    // Assume checkRowPlacement returns a boolean
    const isValidPlacement = solver.checkRowPlacement(
      puzzle,
      row,
      column,
      value
    );
    assert.isTrue(isValidPlacement, "Valid row placement should return true");

    // Check if placing a value that's already there returns false
    const invalidValue = 1;
    const isInvalidPlacement = solver.checkRowPlacement(
      puzzle,
      row,
      column,
      invalidValue
    );
    assert.isFalse(
      isInvalidPlacement,
      "Invalid row placement should return false"
    );

    done();
  });

  test("Logic handles an invalid row placement", (done) => {
    const puzzle =
      "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    const row = 0;
    const column = 2;
    const value = 5;

    const isValidPlacement = solver.checkRowPlacement(
      puzzle,
      row,
      column,
      value
    );
    assert.isFalse(
      isValidPlacement,
      "Invalid row placement should return false"
    );

    done();
  });

  test("Logic handles a valid column placement", (done) => {
    const puzzle =
      "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    const row = 2;
    const column = 0;
    const value = 1;

    const isValidPlacement = solver.checkColPlacement(
      puzzle,
      row,
      column,
      value
    );
    assert.isTrue(
      isValidPlacement,
      "Valid column placement should return true"
    );

    done();
  });

  test("Logic handles an invalid column placement", (done) => {
    const puzzle =
      "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    const row = 2;
    const column = 0;
    const value = 6;

    const isValidPlacement = solver.checkColPlacement(
      puzzle,
      row,
      column,
      value
    );
    assert.isFalse(
      isValidPlacement,
      "Invalid column placement should return false"
    );

    done();
  });

  test("Logic handles a valid region (3x3 grid) placement", (done) => {
    const puzzle =
      "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    const row = 1;
    const column = 1;
    const value = 1;

    const isValidPlacement = solver.checkRegionPlacement(
      puzzle,
      row,
      column,
      value
    );
    assert.isTrue(
      isValidPlacement,
      "Valid region placement should return true"
    );

    done();
  });

  test("Logic handles an invalid region (3x3 grid) placement", (done) => {
    const puzzle =
      "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    const row = 1;
    const column = 1;
    const value = 5;

    const isValidPlacement = solver.checkRegionPlacement(
      puzzle,
      row,
      column,
      value
    );
    assert.isFalse(
      isValidPlacement,
      "Invalid region placement should return false"
    );

    done();
  });

  test("Valid puzzle string passes the solver", (done) => {
    const puzzle =
      "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    const solvedPuzzle = solver.completeSudoku(puzzle);
    assert.isString(solvedPuzzle, "Solved puzzle should be a string");
    assert.lengthOf(
      solvedPuzzle,
      81,
      "Solved puzzle should have 81 characters"
    );
    done();
  });

  test("Invalid puzzle strings fail the solver", (done) => {
    const puzzle =
      "51.91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    assert.throws(
      () => solver.completeSudoku(puzzle),
      /Puzzle cannot be solved/
    );
    assert.isTrue(true);
    done();
  });

  test("Solver returns the expected solution for an incomplete puzzle", (done) => {
    const puzzle =
      "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3"; // 81 characters
    const expectedSolution =
      "568913724342687519197254386685479231219538467734162895926345178473891652851726943";
    const solvedPuzzle = solver.completeSudoku(puzzle);
    assert.equal(
      solvedPuzzle,
      expectedSolution,
      "Solved puzzle does not match the expected solution"
    );
    done();
  });
});
