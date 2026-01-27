import { createInitialBoard } from "#game/logic";
import { describe, expect, it } from "bun:test";

describe("createInitialBoard", () => {
  it("should create initial board", () => {
    const board = createInitialBoard();
    expect(board).toEqual([
      ["EMPTY", "BLACK", "EMPTY", "BLACK", "EMPTY", "BLACK", "EMPTY", "BLACK"],
      ["BLACK", "EMPTY", "BLACK", "EMPTY", "BLACK", "EMPTY", "BLACK", "EMPTY"],
      ["EMPTY", "BLACK", "EMPTY", "BLACK", "EMPTY", "BLACK", "EMPTY", "BLACK"],
      ["EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY"],
      ["EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY"],
      ["WHITE", "EMPTY", "WHITE", "EMPTY", "WHITE", "EMPTY", "WHITE", "EMPTY"],
      ["EMPTY", "WHITE", "EMPTY", "WHITE", "EMPTY", "WHITE", "EMPTY", "WHITE"],
      ["WHITE", "EMPTY", "WHITE", "EMPTY", "WHITE", "EMPTY", "WHITE", "EMPTY"],
    ]);
  });
});
