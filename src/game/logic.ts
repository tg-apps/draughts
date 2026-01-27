import { InlineKeyboard } from "grammy";

const pieceToVisualMap = {
  WHITE: "⚪",
  BLACK: "⚫",
  "WHITE:CROWNED": "🔴",
  "BLACK:CROWNED": "🔵",
  EMPTY: ".",
} as const satisfies Record<Piece, string>;

type Piece = "WHITE" | "BLACK" | "WHITE:CROWNED" | "BLACK:CROWNED" | "EMPTY";
export type Board = Piece[][];

export function createInitialBoard(): Board {
  const board = Array(8)
    .fill(null)
    .map(() => Array<Piece>(8).fill("EMPTY")) satisfies Piece[][];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 !== 0) {
        if (r < 3) board[r]![c] = "BLACK";
        if (r > 4) board[r]![c] = "WHITE";
      }
    }
  }
  return board;
}

export function renderBoard(board: Board, gameId: number): InlineKeyboard {
  const keyboard = new InlineKeyboard();
  board.forEach((row, r) => {
    row.forEach((cell, c) => {
      const label = pieceToVisualMap[cell];
      keyboard.text(label, `move:${gameId}:${r}:${c}`);
    });
    keyboard.row();
  });
  return keyboard;
}
