const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

const validPuzzle =
  "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
const validPlacement = {
  puzzle: validPuzzle,
  coordinate: "A1",
  value: 6,
};

suite("Functional Tests", () => {
  suite("POST /api/solve", () => {
    test("Solve a puzzle with valid puzzle string", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: validPuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, "solution");
          done();
        });
    });

    test("Solve a puzzle with missing puzzle string", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Required field missing");
          done();
        });
    });

    test("Solve a puzzle with invalid characters", (done) => {
      const invalidPuzzle =
        "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...X";
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: invalidPuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });

    test("Solve a puzzle with incorrect length", (done) => {
      const shortPuzzle =
        "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...";
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: shortPuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });

    test("Solve a puzzle that cannot be solved", (done) => {
      const unsolvablePuzzle =
        "51.91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: unsolvablePuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Puzzle cannot be solved");
          done();
        });
    });
  });

  suite("POST /api/check", () => {
    test("Check a puzzle placement with all fields", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: validPuzzle, coordinate: "A1", value: "6" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, "valid");
          assert.property(res.body, "conflict");
          done();
        });
    });

    test("Check a puzzle placement with single placement conflict", (done) => {
      const conflictPlacement = { ...validPlacement, value: "1" }; // Assuming '1' conflicts
      chai
        .request(server)
        .post("/api/check")
        .send(conflictPlacement)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.isArray(res.body.conflict);
          assert.isTrue(res.body.conflict.length > 0);
          done();
        });
    });

    test("Check a puzzle placement with multiple placement conflicts", (done) => {
      const multiConflictPlacement = {
        puzzle: validPuzzle,
        coordinate: "A2",
        value: "5",
      }; // Assuming '5' has multiple conflicts
      chai
        .request(server)
        .post("/api/check")
        .send(multiConflictPlacement)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.isArray(res.body.conflict);
          assert.isTrue(res.body.conflict.length > 1);
          done();
        });
    });

    test("Check a puzzle placement with all placement conflicts", (done) => {
      const allConflictPlacement = {
        puzzle: validPuzzle,
        coordinate: "A2",
        value: "9",
      }; // Assuming '9' conflicts in all fields
      chai
        .request(server)
        .post("/api/check")
        .send(allConflictPlacement)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.isArray(res.body.conflict);
          assert.isTrue(res.body.conflict.length === 3); // Assuming all three conflict types are present
          done();
        });
    });

    test("Check a puzzle placement with missing required fields", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: validPuzzle }) // Missing coordinate and value
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Required field(s) missing");
          done();
        });
    });

    test("Check a puzzle placement with invalid characters", (done) => {
      const invalidPlacement = { ...validPlacement, value: "A" }; // Invalid character
      chai
        .request(server)
        .post("/api/check")
        .send(invalidPlacement)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid value");
          done();
        });
    });

    test("Check a puzzle placement with incorrect length", (done) => {
      const incorrectPlacement = {
        ...validPlacement,
        coordinate: "A10",
        value: "6",
      }; // Incorrect coordinate length
      chai
        .request(server)
        .post("/api/check")
        .send(incorrectPlacement)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid coordinate");
          done();
        });
    });

    test("Check a puzzle placement with invalid placement coordinate", (done) => {
      const invalidCoordinatePlacement = {
        ...validPlacement,
        coordinate: "K1",
        value: "6",
      }; // Invalid coordinate
      chai
        .request(server)
        .post("/api/check")
        .send(invalidCoordinatePlacement)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid coordinate");
          done();
        });
    });

    test("Check a puzzle placement with invalid placement value", (done) => {
      const invalidValuePlacement = { ...validPlacement, value: 10 }; // Invalid value
      chai
        .request(server)
        .post("/api/check")
        .send(invalidValuePlacement)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid value");
          done();
        });
    });
  });
});
