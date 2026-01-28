import { InlineKeyboard } from "grammy";

type PieceLabel =
  | "WHITE"
  | "BLACK"
  | "WHITE:CROWNED"
  | "BLACK:CROWNED"
  | "EMPTY";

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
  private readonly labelToString = {
    WHITE: "⚪",
    BLACK: "⚫",
    "WHITE:CROWNED": "🔴",
    "BLACK:CROWNED": "🔵",
    EMPTY: ".",
  } satisfies Record<PieceLabel, string>;

  readonly type: T["type"];
  readonly color: T["color"];
  readonly variant: T["variant"];
  constructor(readonly piece: T) {
    this.type = piece.type;
    this.color = piece.color;
    this.variant = piece.variant;
  }

  get label(): PieceLabel {
    if (this.isEmpty()) return "EMPTY";
    if (this.color === "white") {
      if (this.variant === "default") return "WHITE";
      return "WHITE:CROWNED";
    }
    if (this.variant === "default") return "BLACK";
    return "BLACK:CROWNED";
  }

  toString(): string {
    return this.labelToString[this.label];
  }

  toJSON(): string {
    return this.label;
  }

  isEmpty(): this is Piece<PieceTypeEmpty> {
    return this.type === "empty";
  }

  static fromLabel(label: PieceLabel): Piece {
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
