import { Board, type PieceLabels } from "#game/board";
import { describe, expect, it } from "bun:test";

describe("Board", () => {
  const testLabels: PieceLabels = [
    ["EMPTY", "BLACK", "EMPTY", "BLACK", "EMPTY", "BLACK", "EMPTY", "BLACK"],
    ["BLACK", "EMPTY", "BLACK", "EMPTY", "BLACK", "EMPTY", "BLACK", "EMPTY"],
    ["EMPTY", "EMPTY", "EMPTY", "BLACK", "EMPTY", "BLACK", "EMPTY", "BLACK"],
    ["BLACK", "EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY"],
    ["EMPTY", "WHITE", "EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY"],
    ["EMPTY", "EMPTY", "WHITE", "EMPTY", "WHITE", "EMPTY", "WHITE", "EMPTY"],
    ["EMPTY", "WHITE", "EMPTY", "WHITE", "EMPTY", "WHITE", "EMPTY", "WHITE"],
    ["WHITE", "EMPTY", "WHITE", "EMPTY", "WHITE", "EMPTY", "WHITE", "EMPTY"],
  ];
  const testData = JSON.stringify(testLabels);

  describe("new Board", () => {
    it("should create initial board", () => {
      const board = new Board();
      // prettier-ignore
      expect(JSON.stringify(board)).toEqual(JSON.stringify([
        ["EMPTY", "BLACK", "EMPTY", "BLACK", "EMPTY", "BLACK", "EMPTY", "BLACK"],
        ["BLACK", "EMPTY", "BLACK", "EMPTY", "BLACK", "EMPTY", "BLACK", "EMPTY"],
        ["EMPTY", "BLACK", "EMPTY", "BLACK", "EMPTY", "BLACK", "EMPTY", "BLACK"],
        ["EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY"],
        ["EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY"],
        ["WHITE", "EMPTY", "WHITE", "EMPTY", "WHITE", "EMPTY", "WHITE", "EMPTY"],
        ["EMPTY", "WHITE", "EMPTY", "WHITE", "EMPTY", "WHITE", "EMPTY", "WHITE"],
        ["WHITE", "EMPTY", "WHITE", "EMPTY", "WHITE", "EMPTY", "WHITE", "EMPTY"],
      ]));
    });

    it("should create a board when `labels` is provided", () => {
      const board = new Board(testLabels);
      expect(JSON.stringify(board)).toEqual(JSON.stringify(testLabels));
    });
  });

  describe("Board.render", () => {
    it("should render initial board", () => {
      const board = new Board();
      const renderedBoard = board.render(999);
      expect(renderedBoard.inline_keyboard).toEqual([
        [
          { text: ".", callback_data: "move:999:0:0" },
          { text: "⚫", callback_data: "move:999:0:1" },
          { text: ".", callback_data: "move:999:0:2" },
          { text: "⚫", callback_data: "move:999:0:3" },
          { text: ".", callback_data: "move:999:0:4" },
          { text: "⚫", callback_data: "move:999:0:5" },
          { text: ".", callback_data: "move:999:0:6" },
          { text: "⚫", callback_data: "move:999:0:7" },
        ],
        [
          { text: "⚫", callback_data: "move:999:1:0" },
          { text: ".", callback_data: "move:999:1:1" },
          { text: "⚫", callback_data: "move:999:1:2" },
          { text: ".", callback_data: "move:999:1:3" },
          { text: "⚫", callback_data: "move:999:1:4" },
          { text: ".", callback_data: "move:999:1:5" },
          { text: "⚫", callback_data: "move:999:1:6" },
          { text: ".", callback_data: "move:999:1:7" },
        ],
        [
          { text: ".", callback_data: "move:999:2:0" },
          { text: "⚫", callback_data: "move:999:2:1" },
          { text: ".", callback_data: "move:999:2:2" },
          { text: "⚫", callback_data: "move:999:2:3" },
          { text: ".", callback_data: "move:999:2:4" },
          { text: "⚫", callback_data: "move:999:2:5" },
          { text: ".", callback_data: "move:999:2:6" },
          { text: "⚫", callback_data: "move:999:2:7" },
        ],
        [
          { text: ".", callback_data: "move:999:3:0" },
          { text: ".", callback_data: "move:999:3:1" },
          { text: ".", callback_data: "move:999:3:2" },
          { text: ".", callback_data: "move:999:3:3" },
          { text: ".", callback_data: "move:999:3:4" },
          { text: ".", callback_data: "move:999:3:5" },
          { text: ".", callback_data: "move:999:3:6" },
          { text: ".", callback_data: "move:999:3:7" },
        ],
        [
          { text: ".", callback_data: "move:999:4:0" },
          { text: ".", callback_data: "move:999:4:1" },
          { text: ".", callback_data: "move:999:4:2" },
          { text: ".", callback_data: "move:999:4:3" },
          { text: ".", callback_data: "move:999:4:4" },
          { text: ".", callback_data: "move:999:4:5" },
          { text: ".", callback_data: "move:999:4:6" },
          { text: ".", callback_data: "move:999:4:7" },
        ],
        [
          { text: "⚪", callback_data: "move:999:5:0" },
          { text: ".", callback_data: "move:999:5:1" },
          { text: "⚪", callback_data: "move:999:5:2" },
          { text: ".", callback_data: "move:999:5:3" },
          { text: "⚪", callback_data: "move:999:5:4" },
          { text: ".", callback_data: "move:999:5:5" },
          { text: "⚪", callback_data: "move:999:5:6" },
          { text: ".", callback_data: "move:999:5:7" },
        ],
        [
          { text: ".", callback_data: "move:999:6:0" },
          { text: "⚪", callback_data: "move:999:6:1" },
          { text: ".", callback_data: "move:999:6:2" },
          { text: "⚪", callback_data: "move:999:6:3" },
          { text: ".", callback_data: "move:999:6:4" },
          { text: "⚪", callback_data: "move:999:6:5" },
          { text: ".", callback_data: "move:999:6:6" },
          { text: "⚪", callback_data: "move:999:6:7" },
        ],
        [
          { text: "⚪", callback_data: "move:999:7:0" },
          { text: ".", callback_data: "move:999:7:1" },
          { text: "⚪", callback_data: "move:999:7:2" },
          { text: ".", callback_data: "move:999:7:3" },
          { text: "⚪", callback_data: "move:999:7:4" },
          { text: ".", callback_data: "move:999:7:5" },
          { text: "⚪", callback_data: "move:999:7:6" },
          { text: ".", callback_data: "move:999:7:7" },
        ],
        [],
      ]);
    });
  });

  describe("Board.fromJSON", () => {
    it("should create a board from JSON", () => {
      const board = Board.fromJSON(testData);
      expect(JSON.stringify(board)).toBe(testData);
    });
  });

  describe("Board.getPiece", () => {
    it("should return correct piece", () => {
      const board = Board.fromJSON(testData);
      const piece1 = board.getPiece(0, 0);
      expect(piece1.type).toBe("empty");
      const piece2 = board.getPiece(0, 1);
      expect(piece2.color).toBe("black");
      const piece3 = board.getPiece(4, 1);
      expect(piece3.color).toBe("white");
    });
  });

  describe("Board.getMoveInfo", () => {
    it("returns step for regular white piece forward move", () => {
      const board = new Board();
      expect(
        board.getMoveInfo({ fromRow: 5, fromCol: 0, toRow: 4, toCol: 1 }),
      ).toEqual({ type: "step" });
    });

    it("returns step for regular black piece forward move", () => {
      const board = new Board();
      expect(
        board.getMoveInfo({ fromRow: 2, fromCol: 1, toRow: 3, toCol: 2 }),
      ).toEqual({ type: "step" });
    });

    it("returns invalid for regular piece backward step", () => {
      const board = new Board();
      expect(
        board.getMoveInfo({ fromRow: 5, fromCol: 0, toRow: 6, toCol: 1 }).type,
      ).toEqual("invalid");
    });

    it("returns invalid for regular piece long step without capture", () => {
      const board = new Board();
      expect(
        board.getMoveInfo({ fromRow: 5, fromCol: 0, toRow: 3, toCol: 2 }),
      ).toEqual({ type: "invalid", reason: "invalid_distance" });
    });

    it("returns invalid when moving from an empty cell", () => {
      const board = new Board();
      expect(
        board.getMoveInfo({ fromRow: 3, fromCol: 0, toRow: 4, toCol: 1 }),
      ).toEqual({ type: "invalid", reason: "from_empty" });
    });

    it("returns invalid when target cell is occupied", () => {
      const board = new Board();
      expect(
        board.getMoveInfo({ fromRow: 5, fromCol: 0, toRow: 7, toCol: 2 }),
      ).toEqual({ type: "invalid", reason: "to_occupied" });
    });

    it("returns invalid for non-diagonal moves or same square", () => {
      const board = new Board();
      // same square
      expect(
        board.getMoveInfo({ fromRow: 5, fromCol: 0, toRow: 5, toCol: 0 }).type,
      ).toEqual("invalid");
      // horizontal
      expect(
        board.getMoveInfo({ fromRow: 5, fromCol: 0, toRow: 5, toCol: 2 }).type,
      ).toEqual("invalid");
      // unequal distances
      expect(
        board.getMoveInfo({ fromRow: 5, fromCol: 0, toRow: 6, toCol: 2 }),
      ).toEqual({ type: "invalid", reason: "invalid_distance" });
    });

    describe("regular piece captures", () => {
      it("allows forward capture", () => {
        const labels: PieceLabels = Array.from({ length: 8 }, () =>
          Array(8).fill("EMPTY"),
        );
        labels[4][1] = "WHITE";
        labels[3][2] = "BLACK";
        const board = new Board(labels);

        expect(
          board.getMoveInfo({ fromRow: 4, fromCol: 1, toRow: 2, toCol: 3 }),
        ).toEqual({
          type: "capture",
          victim: { row: 3, col: 2 },
        });
      });

      it("allows backward capture", () => {
        const labels: PieceLabels = Array.from({ length: 8 }, () =>
          Array(8).fill("EMPTY"),
        );
        labels[3][3] = "WHITE";
        labels[4][4] = "BLACK";
        const board = new Board(labels);

        expect(
          board.getMoveInfo({ fromRow: 3, fromCol: 3, toRow: 5, toCol: 5 }),
        ).toEqual({
          type: "capture",
          victim: { row: 4, col: 4 },
        });
      });

      it("disallows capture over own piece", () => {
        const labels: PieceLabels = Array.from({ length: 8 }, () =>
          Array(8).fill("EMPTY"),
        );
        labels[4][1] = "WHITE";
        labels[3][2] = "WHITE"; // own color
        const board = new Board(labels);

        expect(
          board.getMoveInfo({ fromRow: 4, fromCol: 1, toRow: 2, toCol: 3 }),
        ).toEqual({ type: "invalid", reason: "invalid_victim" });
      });

      it("disallows long capture for regular piece", () => {
        const labels: PieceLabels = Array.from({ length: 8 }, () =>
          Array(8).fill("EMPTY"),
        );
        labels[6][1] = "WHITE";
        labels[4][3] = "BLACK";
        const board = new Board(labels);

        expect(
          board.getMoveInfo({ fromRow: 6, fromCol: 1, toRow: 2, toCol: 5 }),
        ).toEqual({ type: "invalid", reason: "invalid_distance" });
      });
    });

    describe("king moves and captures", () => {
      it("allows king to step any distance diagonally if path is clear", () => {
        const labels: PieceLabels = Array.from({ length: 8 }, () =>
          Array(8).fill("EMPTY"),
        );
        labels[7][1] = "WHITE:CROWNED";
        const board = new Board(labels);

        // short step
        expect(
          board.getMoveInfo({ fromRow: 7, fromCol: 1, toRow: 6, toCol: 2 }),
        ).toEqual({ type: "step" });

        // long step
        expect(
          board.getMoveInfo({ fromRow: 7, fromCol: 1, toRow: 3, toCol: 5 }),
        ).toEqual({ type: "step" });
      });

      it("allows king long capture with single victim", () => {
        const labels: PieceLabels = Array.from({ length: 8 }, () =>
          Array(8).fill("EMPTY"),
        );
        labels[7][1] = "WHITE:CROWNED";
        labels[5][3] = "BLACK";
        const board = new Board(labels);

        expect(
          board.getMoveInfo({ fromRow: 7, fromCol: 1, toRow: 3, toCol: 5 }),
        ).toEqual({
          type: "capture",
          victim: { row: 5, col: 3 },
        });
      });

      it("disallows king step when path is blocked by own piece", () => {
        const labels: PieceLabels = Array.from({ length: 8 }, () =>
          Array(8).fill("EMPTY"),
        );
        labels[7][1] = "WHITE:CROWNED";
        labels[5][3] = "WHITE"; // own piece in path
        const board = new Board(labels);

        expect(
          board.getMoveInfo({ fromRow: 7, fromCol: 1, toRow: 3, toCol: 5 }),
        ).toEqual({ type: "invalid", reason: "invalid_victim" });
      });

      it("disallows capture when multiple victims are in the path", () => {
        const labels: PieceLabels = Array.from({ length: 8 }, () =>
          Array(8).fill("EMPTY"),
        );
        labels[7][1] = "WHITE:CROWNED";
        labels[5][3] = "BLACK";
        labels[4][4] = "BLACK"; // second victim
        const board = new Board(labels);

        expect(
          board.getMoveInfo({ fromRow: 7, fromCol: 1, toRow: 3, toCol: 5 }),
        ).toEqual({ type: "invalid", reason: "multiple_victims" });
      });
    });
  });

  describe("Board.hasAnyCapture", () => {
    it("returns false on the initial board for both colors", () => {
      const board = new Board();
      expect(board.hasAnyCapture("black")).toBeFalse();
      expect(board.hasAnyCapture("white")).toBeFalse();
    });

    it("returns false when there are pieces of the color but no possible captures", () => {
      // All pieces are isolated with no opponent in any capture position
      const labels: PieceLabels = Array.from({ length: 8 }, () =>
        Array(8).fill("EMPTY"),
      );
      labels[4][1] = "WHITE";
      labels[4][3] = "WHITE";
      labels[2][1] = "BLACK";
      labels[2][5] = "BLACK";
      const board = new Board(labels);

      expect(board.hasAnyCapture("white")).toBeFalse();
      expect(board.hasAnyCapture("black")).toBeFalse();
    });

    it("returns true when a regular white man can capture (forward)", () => {
      const labels: PieceLabels = Array.from({ length: 8 }, () =>
        Array(8).fill("EMPTY"),
      );
      // Near edge to prevent mutual capture
      labels[4][7] = "WHITE";
      labels[3][6] = "BLACK";
      const board = new Board(labels);

      expect(board.hasAnyCapture("white")).toBeTrue();
      expect(board.hasAnyCapture("black")).toBeFalse();
    });

    it("returns true when a regular white man can capture (backward)", () => {
      const labels: PieceLabels = Array.from({ length: 8 }, () =>
        Array(8).fill("EMPTY"),
      );
      // Near edge to prevent mutual capture
      labels[3][7] = "WHITE";
      labels[4][6] = "BLACK";
      const board = new Board(labels);

      expect(board.hasAnyCapture("white")).toBeTrue();
      expect(board.hasAnyCapture("black")).toBeFalse();
    });

    it("returns true when a regular black man can capture", () => {
      const labels: PieceLabels = Array.from({ length: 8 }, () =>
        Array(8).fill("EMPTY"),
      );
      // Near edge to prevent mutual capture
      labels[3][0] = "BLACK";
      labels[4][1] = "WHITE";
      const board = new Board(labels);

      expect(board.hasAnyCapture("black")).toBeTrue();
      expect(board.hasAnyCapture("white")).toBeFalse();
    });

    it("returns true when a king can make a long capture", () => {
      const labels: PieceLabels = Array.from({ length: 8 }, () =>
        Array(8).fill("EMPTY"),
      );
      labels[7][1] = "WHITE:CROWNED";
      labels[5][3] = "BLACK";
      const board = new Board(labels);

      expect(board.hasAnyCapture("white")).toBeTrue();
      expect(board.hasAnyCapture("black")).toBeFalse();
    });

    it("returns false for a king when potential captures are invalid (blocked path, own piece, multiple victims)", () => {
      const labels: PieceLabels = Array.from({ length: 8 }, () =>
        Array(8).fill("EMPTY"),
      );
      // Own piece blocking
      labels[7][1] = "WHITE:CROWNED";
      labels[5][3] = "WHITE";
      // Multiple victims scenario
      labels[6][3] = "WHITE:CROWNED";
      labels[4][5] = "BLACK";
      labels[3][6] = "BLACK";
      const board = new Board(labels);

      expect(board.hasAnyCapture("white")).toBeFalse();
    });

    it("returns true when at least one piece of the color has a capture (among many pieces)", () => {
      const labels: PieceLabels = Array.from({ length: 8 }, () =>
        Array(8).fill("EMPTY"),
      );
      // Several white pieces, only one can capture
      labels[4][3] = "WHITE";
      labels[4][5] = "WHITE";
      labels[3][4] = "BLACK";
      labels[2][5] = "WHITE";
      const board = new Board(labels);

      expect(board.hasAnyCapture("white")).toBeTrue();
    });

    it("handles crowned pieces correctly (king with short capture)", () => {
      const labels: PieceLabels = Array.from({ length: 8 }, () =>
        Array(8).fill("EMPTY"),
      );
      labels[4][1] = "WHITE:CROWNED";
      labels[3][2] = "BLACK";
      const board = new Board(labels);

      expect(board.hasAnyCapture("white")).toBeTrue();
    });
  });
});
