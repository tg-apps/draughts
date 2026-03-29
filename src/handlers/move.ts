import { eq } from "drizzle-orm";
import type { Context } from "grammy";
import type { User } from "grammy/types";

import { db } from "#db";
import { games, type GameInfo } from "#db/schema";
import { Board } from "#game/board";
import { getUserDisplayName, upsertUser } from "#utils/user";

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
  ctx: Context & { from: User },
  data: string,
): Promise<true> {
  const { gameId, row, col } = parseData(data);
  const userId = ctx.from.id;

  const game = await db.query.games.findFirst({
    where: (games, { eq }) => eq(games.id, gameId),
  });
  if (!game) return await ctx.answerCallbackQuery("Игра не найдена");

  if (!game.blackPlayer && userId !== game.whitePlayer) {
    upsertUser(ctx.from);
    await db
      .update(games)
      .set({ blackPlayer: userId })
      .where(eq(games.id, gameId));
    game.blackPlayer = userId;
  }

  const board = Board.fromJSON(game.board);

  if (!isTheirTurn(game, userId)) {
    await ctx.answerCallbackQuery("Сейчас не твой ход!");
    await ctx.editMessageReplyMarkup({
      reply_markup: board.render(gameId, game.status),
    });
    return true;
  }

  const piece = board.getPiece(row, col);

  const isOwnPiece = piece.isOfColor(game.turn);

  if (isOwnPiece) {
    // If the player is in a jump chain, they cannot switch to another piece
    if (game.isJumpChain && game.selectedPos !== `${row},${col}`) {
      return await ctx.answerCallbackQuery("Ты обязан бить текущей фигурой!");
    }

    // Don't allow selecting a piece that can't jump if a capture is available
    if (!board.pieceHasCapture(row, col) && board.hasAnyCapture(game.turn)) {
      return await ctx.answerCallbackQuery({
        text: "Бить обязательно! Выбери другую фигуру.",
        show_alert: true,
      });
    }

    await db
      .update(games)
      .set({ selectedPos: `${row},${col}` })
      .where(eq(games.id, gameId));
    return await ctx.answerCallbackQuery("Фигура выбрана");
  }

  if (!game.selectedPos)
    return await ctx.answerCallbackQuery("Выбери свою фигуру!");

  if (!piece.isEmpty()) return await ctx.answerCallbackQuery("Клетка занята!");

  const { row: fromRow, col: fromCol } = parsePos(game.selectedPos);

  const moveInfo = board.getMoveInfo({
    fromRow,
    fromCol,
    toRow: row,
    toCol: col,
  });

  if (moveInfo.type === "invalid") {
    return await ctx.answerCallbackQuery("Так ходить нельзя!");
  }

  const captureAvailable = board.hasAnyCapture(game.turn);

  if (captureAvailable && moveInfo.type !== "capture") {
    return await ctx.answerCallbackQuery("Бить обязательно!");
  }

  if (moveInfo.type === "capture") {
    board.setPiece(moveInfo.victim.row, moveInfo.victim.col, "EMPTY");
  }

  board.makeMove({ fromRow, fromCol, row, col }, moveInfo);

  const canJumpAgain =
    moveInfo.type === "capture" && board.pieceHasCapture(row, col);

  const isWhiteTurn = game.turn === "white";

  const nextTurn = canJumpAgain ? game.turn : isWhiteTurn ? "black" : "white";
  const nextSelectedPos = canJumpAgain ? `${row},${col}` : null;

  const canNextPlayerMove = board.hasAnyMove(nextTurn);

  if (!canNextPlayerMove) {
    // Current player wins because the next player is stuck or out of pieces
    const winnerLabel = isWhiteTurn ? "Белые ⚪" : "Черные ⚫";

    const status = isWhiteTurn ? "white_won" : "black_won";

    await db
      .update(games)
      .set({ board: JSON.stringify(board), status, selectedPos: null })
      .where(eq(games.id, gameId));

    await ctx.editMessageText(
      `🎉 Игра окончена! Победили ${winnerLabel}!\n\n${getPlayersInfo(game)}`,
      { reply_markup: board.render(gameId, status) },
    );
    return await ctx.answerCallbackQuery("Игра окончена!");
  }

  await db
    .update(games)
    .set({
      board: JSON.stringify(board),
      selectedPos: nextSelectedPos,
      turn: nextTurn,
      isJumpChain: canJumpAgain,
    })
    .where(eq(games.id, gameId));

  const moveInfoText = nextTurn === "white" ? "Белые ⚪" : "Черные ⚫";
  const playersInfo = getPlayersInfo(game);
  const messageText = `Ход: ${moveInfoText}\n\n${playersInfo}`;

  await ctx.editMessageText(messageText, {
    reply_markup: board.render(gameId, game.status),
  });

  return await ctx.answerCallbackQuery();
}

function getPlayersInfo(game: GameInfo) {
  const whiteInfo = `Белые: ${getUserDisplayName(game.whitePlayer)}`;
  const blackInfo = game.blackPlayer
    ? `\nЧерные: ${getUserDisplayName(game.blackPlayer)}`
    : "";
  return `${whiteInfo}${blackInfo}`;
}
