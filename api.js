"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const puzzle = req.body.puzzle;
    const coordinate = req.body.coordinate;
    let value = req.body.value;

    // Log incoming request for debugging
    console.log("Received request with:", { puzzle, coordinate, value });

    // Check for missing fields
    if (!puzzle || !coordinate || value === undefined) {
      console.log("Error: Required field(s) missing");
      return res.json({ error: "Required field(s) missing" });
    }

    // Ensure value is a string and convert to integer
    if (typeof value === "string") {
      value = parseInt(value, 10);
    } else if (typeof value === "number" && !isNaN(value)) {
      // If value is already a number and valid, proceed
    } else {
      console.log("Error: Invalid value type");
      return res.json({ error: "Invalid value" });
    }

    // Validate the value
    if (isNaN(value) || value < 1 || value > 9) {
      console.log("Error: Invalid value range");
      return res.json({ error: "Invalid value" });
    }

    // Validate the puzzle
    if (typeof puzzle !== "string" || /[^1-9.]/g.test(puzzle)) {
      console.log("Error: Invalid characters in puzzle");
      return res.json({ error: "Invalid characters in puzzle" });
    }

    // Clean and validate puzzle length
    const cleanPuzzle = puzzle.replace(/\s+/g, "");
    if (cleanPuzzle.length !== 81) {
      console.log("Error: Invalid puzzle length");
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    }

    // Validate coordinates
    const row = coordinate[0].toLowerCase();
    const column = parseInt(coordinate[1], 10);

    if (
      coordinate.length !== 2 ||
      !/[a-i]/i.test(row) ||
      isNaN(column) ||
      column < 1 ||
      column > 9
    ) {
      console.log("Error: Invalid coordinate");
      return res.json({ error: "Invalid coordinate" });
    }

    const rowIndex = row.charCodeAt(0) - "a".charCodeAt(0);
    const colIndex = column - 1;

    // Check if the coordinate is within the valid range
    if (rowIndex < 0 || rowIndex > 8 || colIndex < 0 || colIndex > 8) {
      console.log("Error: Coordinate out of range");
      return res.json({ error: "Invalid coordinate" });
    }

    // Check if the value is already present at the specified coordinate
    const board = solver.stringToBoard(cleanPuzzle);
    if (board[rowIndex][colIndex] === value) {
      console.log("Value is already present at the specified coordinate");
      return res.json({ valid: true });
    }

    // Initialize conflicts array
    let conflictsArray = [];

    // Check placement validity
    let validRow = solver.checkRowPlacement(
      cleanPuzzle,
      rowIndex,
      colIndex,
      value
    );
    let validCol = solver.checkColPlacement(
      cleanPuzzle,
      rowIndex,
      colIndex,
      value
    );
    let validRegion = solver.checkRegionPlacement(
      cleanPuzzle,
      rowIndex,
      colIndex,
      value
    );

    if (!validRow) conflictsArray.push("row");
    if (!validCol) conflictsArray.push("column");
    if (!validRegion) conflictsArray.push("region");

    // Return the response based on conflicts
    if (conflictsArray.length === 0) {
      console.log("Placement is valid");
      return res.json({ valid: true });
    } else {
      console.log("Placement conflicts:", conflictsArray);
      return res.json({ valid: false, conflict: conflictsArray });
    }
  });

  app.route("/api/solve").post((req, res) => {
    const puzzle = req.body.puzzle;

    if (!puzzle) {
      return res.json({ error: "Required field missing" });
    }

    if (typeof puzzle !== "string" || /[^1-9.]/g.test(puzzle)) {
      return res.json({ error: "Invalid characters in puzzle" });
    }

    const cleanPuzzle = puzzle.replace(/\s+/g, "");
    if (cleanPuzzle.length !== 81) {
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    }

    try {
      const solution = solver.completeSudoku(cleanPuzzle);
      return res.json({ solution });
    } catch (error) {
      return res.json({ error: "Puzzle cannot be solved" });
    }
  });
};
