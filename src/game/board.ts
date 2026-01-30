import { InlineKeyboard } from "grammy";

import type { PieceColor, PieceLabel } from "./piece";
import { Piece } from "./piece";

export type PieceLabels = readonly (readonly PieceLabel[])[];
export type BoardCells = readonly Piece[][];

type MoveInfo =
  | {
      readonly type: "invalid";
      readonly reason:
        | "from_empty"
        | "to_occupied"
        | "invalid_distance"
        | "invalid_victim"
        | "multiple_victims";
    }
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
    if (piece.isEmpty()) return { type: "invalid", reason: "from_empty" };

    const toPiece = this.getPiece(toRow, toCol);
    if (!toPiece.isEmpty()) {
      return { type: "invalid", reason: "to_occupied" };
    }

    const dr = toRow - fromRow;
    const dc = toCol - fromCol;

    // Must be diagonal and not the same square
    if (Math.abs(dr) !== Math.abs(dc) || (dr === 0 && dc === 0)) {
      return { type: "invalid", reason: "invalid_distance" };
    }

    const distance = Math.abs(dr);
    const dirR = Math.sign(dr);
    const dirC = Math.sign(dc);

    // Scan the path between from and to (exclusive)
    let victim: { row: number; col: number } | null = null;
    let hasVictim = false;

    for (let i = 1; i < distance; i++) {
      const checkRow = fromRow + i * dirR;
      const checkCol = fromCol + i * dirC;
      const checkPiece = this.getPiece(checkRow, checkCol);

      if (checkPiece.isEmpty()) continue;

      // Must be an opponent
      if (!checkPiece.isOfOppositeColor(piece)) {
        return { type: "invalid", reason: "invalid_victim" };
      }

      // Only one victim allowed per line (flying kings capture one per jump)
      if (hasVictim) {
        return { type: "invalid", reason: "multiple_victims" };
      }

      hasVictim = true;
      victim = { row: checkRow, col: checkCol };
    }

    const isCrowned = piece.isCrowned();

    if (!hasVictim) {
      if (isCrowned) {
        // Kings can slide any distance diagonally in any direction if path is clear
        return { type: "step" };
      }

      // Regular pieces: only one square forward
      if (distance !== 1) {
        return { type: "invalid", reason: "invalid_distance" };
      }

      const forwardDir = piece.isOfColor("white") ? -1 : 1;
      if (dirR === forwardDir) {
        return { type: "step" };
      }
    }

    // Regular pieces can only short-jump (distance 2); kings can long-jump
    if (!isCrowned && distance !== 2) {
      return { type: "invalid", reason: "invalid_distance" };
    }

    if (!victim) {
      return { type: "invalid", reason: "invalid_victim" };
    }

    return { type: "capture", victim };
  }

  hasAnyCapture(color: PieceColor): boolean {
    // Early exit as soon as we find any valid capture
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = this.getPiece(r, c);
        if (!piece.isOfColor(color)) continue;
        if (this.pieceHasCapture(r, c)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Checks if the piece at (`fromRow`, `fromCol`) has at least one capture
   */
  pieceHasCapture(fromRow: number, fromCol: number): boolean {
    const piece = this.getPiece(fromRow, fromCol);

    const directions: readonly (readonly [number, number])[] = [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];

    for (const [dirR, dirC] of directions) {
      // Compute max possible distance in this direction
      let testR = fromRow + dirR;
      let testC = fromCol + dirC;
      let maxDist = 0;
      while (testR >= 0 && testR < 8 && testC >= 0 && testC < 8) {
        maxDist++;
        testR += dirR;
        testC += dirC;
      }

      // Need at least distance 2 for a capture
      if (maxDist < 2) continue;

      const isKing = piece.isCrowned();

      // For men: only distance === 2 is possible
      // For kings: any distance >= 2 (as long as exactly one opponent in path)
      const endDist = isKing ? maxDist : 2;

      for (let d = 2; d <= endDist; d++) {
        const toRow = fromRow + d * dirR;
        const toCol = fromCol + d * dirC;

        const moveInfo = this.getMoveInfo({
          fromRow,
          fromCol,
          toRow,
          toCol,
        });

        if (moveInfo.type === "capture") {
          return true;
        }

        // For kings: if there are multiple victims, later distances are impossible
        // We can early-skip remaining distances in this direction
        if (
          isKing &&
          moveInfo.type === "invalid" &&
          (moveInfo.reason === "invalid_victim" ||
            moveInfo.reason === "multiple_victims")
        ) {
          break;
        }
      }
    }

    return false;
  }
}
