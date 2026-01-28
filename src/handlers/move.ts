import type { Context } from "grammy";
import type { User } from "grammy/types";

import { db } from "#db";
import { games, type GameInfo } from "#db/schema";
import { Board } from "#game/logic";
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

  const isOwnPiece = piece.isOwnPiece(game.turn);

  if (!game.selectedPos) {
    if (!isOwnPiece) return ctx.answerCallbackQuery("Выбери свою фигуру!");

    await db
      .update(games)
      .set({ selectedPos: `${row},${col}` })
      .where(eq(games.id, gameId));
    return ctx.answerCallbackQuery("Фигура выбрана. Куда идем?");
  }

  const [fromRow, fromCol] = game.selectedPos.split(",").map(Number);

  if (isOwnPiece) {
    await db
      .update(games)
      .set({ selectedPos: `${row},${col}` })
      .where(eq(games.id, gameId));
    return ctx.answerCallbackQuery("Фигура перевыбрана");
  }

  if (!piece.isEmpty()) return ctx.answerCallbackQuery("Клетка занята!");

  const isWhiteTurn = game.turn === "white";

  const distR = row - fromRow;
  const distC = Math.abs(col - fromCol);
  const isCapture = Math.abs(distR) === 2 && distC === 2;
  const isStep = (isWhiteTurn ? distR === -1 : distR === 1) && distC === 1;

  if (!isStep && !isCapture)
    return ctx.answerCallbackQuery("Так ходить нельзя!");

  if (isCapture) {
    const midR = (row + fromRow) / 2;
    const midC = (col + fromCol) / 2;
    const victim = board.getPiece(midR, midC);
    if (victim.isEmpty()) return ctx.answerCallbackQuery("Там некого прыгать");
    board.cells[midR][midC] = Piece.fromLabel("EMPTY");
  }

  board.cells[row][col] = board.getPiece(fromRow, fromCol);
  board.cells[fromRow][fromCol] = "EMPTY";

  if (isWhiteTurn && row === 0)
    board.cells[row][col] = Piece.fromLabel("WHITE:CROWNED");
  if (!isWhiteTurn && row === 7)
    board.cells[row][col] = Piece.fromLabel("BLACK:CROWNED");

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
