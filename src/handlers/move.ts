import type { Context } from "grammy";
import type { User } from "grammy/types";

import { db } from "#db";
import { games, type GameInfo } from "#db/schema";
import { Board } from "#game/board";
import { Piece } from "#game/piece";
import { eq } from "drizzle-orm";

function parseData(data: string): { gameId: number; row: number; col: number } {
  const [, gameIdStr, r, c] = data.split(":");
  if (!gameIdStr || !r || !c) throw new Error("Invalid data format");
  const gameId = parseInt(gameIdStr);
  const row = parseInt(r);
  const col = parseInt(c);
  return { gameId, row, col };
}

function isTheirTurn(game: GameInfo, userId: number) {
  const isWhiteTurn = game.turn === "white";
  const currentPlayerId = isWhiteTurn ? game.whitePlayer : game.blackPlayer;
  return userId === currentPlayerId;
}

function parsePos(pos: string): { row: number; col: number } {
  const [row, col] = pos.split(",").map(Number);
  if (row === undefined || col === undefined)
    throw new Error(`Invalid data format: ${pos}`);
  return { row, col };
}

export async function handleMoveCallback(
  ctx: {
    from: User;
    answerCallbackQuery: Context["answerCallbackQuery"];
    editMessageText: Context["editMessageText"];
  },
  data: string,
): Promise<true | undefined> {
  const { gameId, row, col } = parseData(data);
  const userId = ctx.from.id;

  const game = await db.query.games.findFirst({ where: eq(games.id, gameId) });
  if (!game) return ctx.answerCallbackQuery("Игра не найдена");

  if (!game.blackPlayer && userId !== game.whitePlayer) {
    await db
      .update(games)
      .set({ blackPlayer: userId })
      .where(eq(games.id, gameId));
    game.blackPlayer = userId;
  }

  if (!isTheirTurn(game, userId)) {
    return ctx.answerCallbackQuery("Сейчас не твой ход!");
  }

  const board = Board.fromJSON(game.board);
  const piece = board.getPiece(row, col);

  const isOwnPiece = piece.isOfColor(game.turn);

  if (!game.selectedPos) {
    if (!isOwnPiece) return ctx.answerCallbackQuery("Выбери свою фигуру!");

    await db
      .update(games)
      .set({ selectedPos: `${row},${col}` })
      .where(eq(games.id, gameId));
    return ctx.answerCallbackQuery("Фигура выбрана. Куда идем?");
  }

  if (isOwnPiece) {
    await db
      .update(games)
      .set({ selectedPos: `${row},${col}` })
      .where(eq(games.id, gameId));
    return ctx.answerCallbackQuery("Фигура перевыбрана");
  }

  if (!piece.isEmpty()) return ctx.answerCallbackQuery("Клетка занята!");

  const { row: fromRow, col: fromCol } = parsePos(game.selectedPos);

  const moveInfo = board.getMoveInfo({
    fromRow,
    fromCol,
    toRow: row,
    toCol: col,
  });

  if (moveInfo.type === "invalid") {
    return ctx.answerCallbackQuery("Так ходить нельзя!");
  }

  const captureAvailable = board.hasAnyCapture(game.turn);

  if (captureAvailable && moveInfo.type !== "capture") {
    return ctx.answerCallbackQuery("Бить обязательно!");
  }

  if (moveInfo.type === "capture") {
    board.setPiece(
      moveInfo.victim.row,
      moveInfo.victim.col,
      Piece.from("EMPTY"),
    );
  }

  board.setPiece(row, col, board.getPiece(fromRow, fromCol));
  board.setPiece(fromRow, fromCol, Piece.from("EMPTY"));

  const isWhiteTurn = game.turn === "white";

  if (isWhiteTurn && row === 0) {
    board.setPiece(row, col, Piece.from("WHITE:CROWNED"));
  }
  if (!isWhiteTurn && row === 7) {
    board.setPiece(row, col, Piece.from("BLACK:CROWNED"));
  }

  const nextTurn = board.pieceHasCapture(row, col)
    ? game.turn
    : isWhiteTurn
      ? "black"
      : "white";

  await db
    .update(games)
    .set({
      board: JSON.stringify(board),
      selectedPos: null,
      turn: nextTurn,
    })
    .where(eq(games.id, gameId));

  await ctx.editMessageText(
    `Ход: ${nextTurn === "white" ? "Белые ⚪" : "Черные ⚫"}`,
    { reply_markup: board.render(gameId) },
  );

  await ctx.answerCallbackQuery();
}
