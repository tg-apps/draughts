import { InlineKeyboard } from "grammy";

import { Piece, type PieceLabel } from "./piece";

export type PieceLabels = readonly (readonly PieceLabel[])[];
export type BoardCells = readonly Piece[][];

type MoveInfo =
  | { readonly type: "invalid" }
  | { readonly type: "step" }
  | {
      readonly type: "capture";
      readonly victim: { readonly row: number; readonly col: number };
    };

export class Board {
  readonly #cells: BoardCells;
  constructor(labels?: PieceLabels) {
    if (labels) {
      this.#cells = labels.map((row) => row.map((label) => Piece.from(label)));
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

  getMoveInfo({
    fromRow,
    fromCol,
    toRow,
    toCol,
  }: {
    fromRow: number;
    fromCol: number;
    toRow: number;
    toCol: number;
  }): MoveInfo {
    const piece = this.getPiece(fromRow, fromCol);
    if (piece.isEmpty()) return { type: "invalid" };
    if (this.getPiece(toRow, toCol)) return { type: "invalid" };

    const distRow = toRow - fromRow;
    const distCol = Math.abs(toCol - fromCol);

    const isStep =
      (piece.isOfColor("white") ? distRow === -1 : distRow === 1) &&
      distCol === 1;

    if (isStep) return { type: "step" };

    const isCapture = Math.abs(distRow) === 2 && distCol === 2;

    if (!isCapture) return { type: "invalid" };

    const midRow = (toRow + fromRow) / 2;
    const midCol = (toCol + fromCol) / 2;
    const victim = this.getPiece(midRow, midCol);

    if (victim.isEmpty()) return { type: "invalid" };

    return { type: "capture", victim: { row: midRow, col: midCol } };
  }
}
