import { Board } from "#game/logic";
import { describe, expect, it } from "bun:test";

describe("Board", () => {
  it("should create initial board", () => {
    const board = new Board();
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
});

describe("renderBoard", () => {
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
