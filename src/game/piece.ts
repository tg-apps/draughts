export type PieceLabel =
  | "WHITE"
  | "BLACK"
  | "WHITE:CROWNED"
  | "BLACK:CROWNED"
  | "EMPTY";

type EmptyPiece = {
  readonly type: "empty";
  readonly color?: never;
  readonly variant?: never;
};

type PieceColor = "white" | "black";
type PieceVariant = "default" | "crowned";

type PieceOfColor<Color extends PieceColor = PieceColor> = {
  readonly type: "piece";
  readonly color: Color;
  readonly variant: PieceVariant;
};

type PieceOfVariant<Variant extends PieceVariant = PieceVariant> = {
  readonly type: "piece";
  readonly color: PieceColor;
  readonly variant: Variant;
};

type PieceTypePiece = PieceOfColor & PieceOfVariant;

type PieceType = EmptyPiece | PieceTypePiece;

export class Piece<T extends PieceType = PieceType> {
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
  constructor(piece: T) {
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

  isEmpty(): this is Piece<EmptyPiece> {
    return this.type === "empty";
  }

  isOfColor<Color extends PieceColor>(
    color: Color,
  ): this is PieceOfColor<Color> {
    return this.color === color;
  }

  static from(label: PieceLabel): Piece {
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
