import { InlineKeyboard } from "grammy";

const pieceToVisualMap = {
  WHITE: "⚪",
  BLACK: "⚫",
  "WHITE:CROWNED": "🔴",
  "BLACK:CROWNED": "🔵",
  EMPTY: ".",
} as const satisfies Record<PieceTypeName, string>;

type PieceTypeEmpty = {
  readonly type: "empty";
  color?: never;
  variant?: never;
};

type PieceType =
  | PieceTypeEmpty
  | {
      readonly type: "piece";
      readonly color: "white" | "black";
      readonly variant: "default" | "crowned";
    };

class Piece<T extends PieceType = PieceType> {
  readonly type: T["type"];
  readonly color: T["color"];
  readonly variant: T["variant"];
  constructor(readonly piece: T) {
    this.type = piece.type;
    this.color = piece.color;
    this.variant = piece.variant;
  }

  toString(): string {
    if (this.isEmpty()) return ".";
    if (this.color === "white") {
      if (this.variant === "default") return "⚪";
      return "🔴";
    }
    if (this.variant === "default") return "⚫";
    return "🔵";
  }

  isEmpty(): this is Piece<PieceTypeEmpty> {
    return this.type === "empty";
  }

  static fromLabel(label: PieceTypeName): Piece {
    if (label === "EMPTY") return new Piece({ type: "empty" });
    if (label === "WHITE") {
      return new Piece({ type: "piece", color: "white", variant: "default" });
    }
    if (label === "WHITE:CROWNED") {
      return new Piece({ type: "piece", color: "white", variant: "crowned" });
    }
    if (label === "BLACK") {
      return new Piece({ type: "piece", color: "black", variant: "default" });
    }
    return new Piece({ type: "piece", color: "black", variant: "crowned" });
  }
}

export class Board {
  readonly board: readonly (readonly Piece[])[];
  constructor() {
    const board = Array.from<undefined, readonly Piece[]>({ length: 8 }, () =>
      Array.from<undefined, Piece>({ length: 8 }, () =>
        Piece.fromLabel("EMPTY"),
      ),
    );

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if ((r + c) % 2 !== 0) {
          if (r < 3) board[r]![c] = Piece.fromLabel("BLACK");
          if (r > 4) board[r]![c] = Piece.fromLabel("WHITE");
        }
      }
    }
    this.board = board;
  }
}

type PieceTypeName =
  | "WHITE"
  | "BLACK"
  | "WHITE:CROWNED"
  | "BLACK:CROWNED"
  | "EMPTY";
export type Board_legacy = PieceTypeName[][];

export function createInitialBoard(): Board_legacy {
  const board = Array(8)
    .fill(null)
    .map(() =>
      Array<PieceTypeName>(8).fill("EMPTY"),
    ) satisfies PieceTypeName[][];

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

export function renderBoard(
  board: Board_legacy,
  gameId: number,
): InlineKeyboard {
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
