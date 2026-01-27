import { createInitialBoard, renderBoard } from "#game/logic";
import { describe, expect, it } from "bun:test";

describe("renderBoard", () => {
  it("should render initial board", () => {
    const board = createInitialBoard();
    const renderedBoard = renderBoard(board, 0);
    expect(renderedBoard.inline_keyboard).toEqual([
      [
        { text: ".", callback_data: "move:0:0:0" },
        { text: "⚫", callback_data: "move:0:0:1" },
        { text: ".", callback_data: "move:0:0:2" },
        { text: "⚫", callback_data: "move:0:0:3" },
        { text: ".", callback_data: "move:0:0:4" },
        { text: "⚫", callback_data: "move:0:0:5" },
        { text: ".", callback_data: "move:0:0:6" },
        { text: "⚫", callback_data: "move:0:0:7" },
      ],
      [
        { text: "⚫", callback_data: "move:0:1:0" },
        { text: ".", callback_data: "move:0:1:1" },
        { text: "⚫", callback_data: "move:0:1:2" },
        { text: ".", callback_data: "move:0:1:3" },
        { text: "⚫", callback_data: "move:0:1:4" },
        { text: ".", callback_data: "move:0:1:5" },
        { text: "⚫", callback_data: "move:0:1:6" },
        { text: ".", callback_data: "move:0:1:7" },
      ],
      [
        { text: ".", callback_data: "move:0:2:0" },
        { text: "⚫", callback_data: "move:0:2:1" },
        { text: ".", callback_data: "move:0:2:2" },
        { text: "⚫", callback_data: "move:0:2:3" },
        { text: ".", callback_data: "move:0:2:4" },
        { text: "⚫", callback_data: "move:0:2:5" },
        { text: ".", callback_data: "move:0:2:6" },
        { text: "⚫", callback_data: "move:0:2:7" },
      ],
      [
        { text: ".", callback_data: "move:0:3:0" },
        { text: ".", callback_data: "move:0:3:1" },
        { text: ".", callback_data: "move:0:3:2" },
        { text: ".", callback_data: "move:0:3:3" },
        { text: ".", callback_data: "move:0:3:4" },
        { text: ".", callback_data: "move:0:3:5" },
        { text: ".", callback_data: "move:0:3:6" },
        { text: ".", callback_data: "move:0:3:7" },
      ],
      [
        { text: ".", callback_data: "move:0:4:0" },
        { text: ".", callback_data: "move:0:4:1" },
        { text: ".", callback_data: "move:0:4:2" },
        { text: ".", callback_data: "move:0:4:3" },
        { text: ".", callback_data: "move:0:4:4" },
        { text: ".", callback_data: "move:0:4:5" },
        { text: ".", callback_data: "move:0:4:6" },
        { text: ".", callback_data: "move:0:4:7" },
      ],
      [
        { text: "⚪", callback_data: "move:0:5:0" },
        { text: ".", callback_data: "move:0:5:1" },
        { text: "⚪", callback_data: "move:0:5:2" },
        { text: ".", callback_data: "move:0:5:3" },
        { text: "⚪", callback_data: "move:0:5:4" },
        { text: ".", callback_data: "move:0:5:5" },
        { text: "⚪", callback_data: "move:0:5:6" },
        { text: ".", callback_data: "move:0:5:7" },
      ],
      [
        { text: ".", callback_data: "move:0:6:0" },
        { text: "⚪", callback_data: "move:0:6:1" },
        { text: ".", callback_data: "move:0:6:2" },
        { text: "⚪", callback_data: "move:0:6:3" },
        { text: ".", callback_data: "move:0:6:4" },
        { text: "⚪", callback_data: "move:0:6:5" },
        { text: ".", callback_data: "move:0:6:6" },
        { text: "⚪", callback_data: "move:0:6:7" },
      ],
      [
        { text: "⚪", callback_data: "move:0:7:0" },
        { text: ".", callback_data: "move:0:7:1" },
        { text: "⚪", callback_data: "move:0:7:2" },
        { text: ".", callback_data: "move:0:7:3" },
        { text: "⚪", callback_data: "move:0:7:4" },
        { text: ".", callback_data: "move:0:7:5" },
        { text: "⚪", callback_data: "move:0:7:6" },
        { text: ".", callback_data: "move:0:7:7" },
      ],
      [],
    ]);
  });
});
