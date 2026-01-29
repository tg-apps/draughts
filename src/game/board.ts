import { InlineKeyboard } from "grammy";

import { Piece, type PieceLabel } from "./piece";

export type PieceLabels = readonly (readonly PieceLabel[])[];
export type BoardCells = readonly Piece[][];

export class Board {
  readonly #cells: BoardCells;
  constructor(labels?: PieceLabels) {
    if (labels) {
      this.#cells = Array.from(labels, (labelsRow) =>
        Array.from(labelsRow, (label) => Piece.from(label)),
      );
      return;
    }

    this.#cells = Array.from({ length: 8 }, (_, r) =>
      Array.from({ length: 8 }, (_, c) => {
        if ((r + c) % 2 === 0) return Piece.from("EMPTY");
        return Piece.from(r < 3 ? "BLACK" : r > 4 ? "WHITE" : "EMPTY");
      }),
    );
  }

  toJSON(): BoardCells {
    return this.#cells;
  }

  static fromJSON(board: string): Board {
    const labels: PieceLabels = JSON.parse(board);
    return new Board(labels);
  }

  getPiece(row: number, col: number): Piece {
    const piece = this.#cells[row]?.[col];
    if (!piece) throw new Error("Piece not found");
    return piece;
  }

  setPiece(row: number, col: number, piece: Piece): void {
    if (!this.#cells[row]?.[col]) throw new Error("Cell not found");
    this.#cells[row][col] = piece;
  }

  render(gameId: number): InlineKeyboard {
    const keyboard = new InlineKeyboard();
    this.#cells.forEach((row, r) => {
      row.forEach((cell, c) => {
        keyboard.text(cell.toString(), `move:${gameId}:${r}:${c}`);
      });
      keyboard.row();
    });
    return keyboard;
  }
}
