import type { Context } from "grammy";
import type { User } from "grammy/types";

import { db } from "#db";
import { games } from "#db/schema";
import { Board } from "#game/logic";
import { eq } from "drizzle-orm";

export async function handleQueryCallback(ctx: {
  callbackQuery: { data: string };
  from: User;
  answerCallbackQuery: Context["answerCallbackQuery"];
  editMessageText: Context["editMessageText"];
}): Promise<true | undefined> {
  const data = ctx.callbackQuery.data;
  if (!data.startsWith("move:")) return;

  const [, gameIdStr, r, c] = data.split(":");
  const gameId = parseInt(gameIdStr);
  const row = parseInt(r);
  const col = parseInt(c);
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

  const isWhiteTurn = game.turn === "white";
  const currentPlayerId = isWhiteTurn ? game.whitePlayer : game.blackPlayer;

  if (userId !== currentPlayerId) {
    return ctx.answerCallbackQuery("Сейчас не твой ход!");
  }

  const board = Board.fromJSON(game.board);
  const piece = board[row][col];

  if (!game.selectedPos) {
    const isOwnPiece = isWhiteTurn
      ? piece === "WHITE" || piece === "WHITE:CROWNED"
      : piece === "BLACK" || piece === "BLACK:CROWNED";

    if (!isOwnPiece) return ctx.answerCallbackQuery("Выбери свою фигуру!");

    await db
      .update(games)
      .set({ selectedPos: `${row},${col}` })
      .where(eq(games.id, gameId));
    return ctx.answerCallbackQuery("Фигура выбрана. Куда идем?");
  }

  const [fromR, fromC] = game.selectedPos.split(",").map(Number);

  const isOwnPiece = isWhiteTurn
    ? piece === "WHITE" || piece === "WHITE:CROWNED"
    : piece === "BLACK" || piece === "BLACK:CROWNED";
  if (isOwnPiece) {
    await db
      .update(games)
      .set({ selectedPos: `${row},${col}` })
      .where(eq(games.id, gameId));
    return ctx.answerCallbackQuery("Фигура перевыбрана");
  }

  if (piece !== "EMPTY") return ctx.answerCallbackQuery("Клетка занята!");

  const distR = row - fromR;
  const distC = Math.abs(col - fromC);
  const isCapture = Math.abs(distR) === 2 && distC === 2;
  const isStep = (isWhiteTurn ? distR === -1 : distR === 1) && distC === 1;

  if (!isStep && !isCapture)
    return ctx.answerCallbackQuery("Так ходить нельзя!");

  if (isCapture) {
    const midR = (row + fromR) / 2;
    const midC = (col + fromC) / 2;
    const victim = board[midR][midC];
    if (victim === "EMPTY")
      return ctx.answerCallbackQuery("Там некого прыгать");
    board[midR][midC] = "EMPTY";
  }

  board[row][col] = board[fromR][fromC];
  board[fromR][fromC] = "EMPTY";

  if (isWhiteTurn && row === 0) board[row][col] = "WHITE:CROWNED";
  if (!isWhiteTurn && row === 7) board[row][col] = "BLACK:CROWNED";

  const nextTurn = isWhiteTurn ? "black" : "white";

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
