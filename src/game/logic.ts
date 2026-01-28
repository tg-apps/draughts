import { InlineKeyboard } from "grammy";
import { Piece } from "./piece";

type Cells = readonly (readonly Piece[])[];

export class Board {
  private readonly cells: Cells;
  constructor(readonly existingCells?: Cells) {
    if (existingCells) {
      this.cells = existingCells;
      return;
    }

    const cells = Array.from<undefined, Piece[]>({ length: 8 }, () =>
      Array.from<undefined, Piece>({ length: 8 }, () =>
        Piece.fromLabel("EMPTY"),
      ),
    );

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if ((r + c) % 2 !== 0) {
          if (r < 3) cells[r]![c] = Piece.fromLabel("BLACK");
          if (r > 4) cells[r]![c] = Piece.fromLabel("WHITE");
        }
      }
    }
    this.cells = cells;
  }

  toJSON(): Cells {
    return this.cells;
  }

  static fromJSON(board: string): Board {
    return new Board(JSON.parse(board));
  }

  render(gameId: number): InlineKeyboard {
    const keyboard = new InlineKeyboard();
    this.cells.forEach((row, r) => {
      row.forEach((cell, c) => {
        keyboard.text(cell.toString(), `move:${gameId}:${r}:${c}`);
      });
      keyboard.row();
    });
    return keyboard;
  }
}
