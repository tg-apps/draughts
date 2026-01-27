import { run } from "@grammyjs/runner";
import { eq } from "drizzle-orm";
import { Bot, InlineKeyboard } from "grammy";

import { db } from "./db";
import { games } from "./db/schema";

const TOKEN = process.env["TOKEN"];
if (!TOKEN) throw new Error("Missing TOKEN env variable");

const bot = new Bot(TOKEN);

type Piece = "⚪" | "⚫" | "🔴" | "🔵" | "empty";
type Board = Piece[][];

const createInitialBoard = (): Board => {
  const board: Board = Array(8)
    .fill(null)
    .map(() => Array(8).fill("empty"));
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 !== 0) {
        if (r < 3) board[r][c] = "⚫";
        if (r > 4) board[r][c] = "⚪";
      }
    }
  }
  return board;
};

function renderBoard(board: Board, gameId: number) {
  const keyboard = new InlineKeyboard();
  board.forEach((row, r) => {
    row.forEach((cell, c) => {
      const label = cell === "empty" ? ((r + c) % 2 === 0 ? "." : ".") : cell;
      keyboard.text(label, `move:${gameId}:${r}:${c}`);
    });
    keyboard.row();
  });
  return keyboard;
}

bot.command("start", async (ctx) => {
  const initialBoard = createInitialBoard();
  const [newGame] = await db
    .insert(games)
    .values({
      chatId: ctx.chat.id,
      board: JSON.stringify(initialBoard),
      whitePlayer: ctx.from?.id,
      turn: "white",
      status: "playing",
    })
    .returning();

  await ctx.reply(
    `Игра началась!\nБелые: ${ctx.from?.first_name}\nЧерные: ожидаем хода противника...`,
    { reply_markup: renderBoard(initialBoard, newGame.id) },
  );
});

bot.on("callback_query:data", async (ctx) => {
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

  const board: Board = JSON.parse(game.board);
  const piece = board[row][col];

  if (!game.selectedPos) {
    const isOwnPiece = isWhiteTurn
      ? piece === "⚪" || piece === "🔴"
      : piece === "⚫" || piece === "🔵";

    if (!isOwnPiece) return ctx.answerCallbackQuery("Выбери свою фигуру!");

    await db
      .update(games)
      .set({ selectedPos: `${row},${col}` })
      .where(eq(games.id, gameId));
    return ctx.answerCallbackQuery("Фигура выбрана. Куда идем?");
  }

  const [fromR, fromC] = game.selectedPos.split(",").map(Number);

  const isOwnPiece = isWhiteTurn
    ? piece === "⚪" || piece === "🔴"
    : piece === "⚫" || piece === "🔵";
  if (isOwnPiece) {
    await db
      .update(games)
      .set({ selectedPos: `${row},${col}` })
      .where(eq(games.id, gameId));
    return ctx.answerCallbackQuery("Фигура перевыбрана");
  }

  if (piece !== "empty") return ctx.answerCallbackQuery("Клетка занята!");

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
    if (victim === "empty")
      return ctx.answerCallbackQuery("Там некого прыгать");
    board[midR][midC] = "empty";
  }

  board[row][col] = board[fromR][fromC];
  board[fromR][fromC] = "empty";

  if (isWhiteTurn && row === 0) board[row][col] = "🔴";
  if (!isWhiteTurn && row === 7) board[row][col] = "🔵";

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
    { reply_markup: renderBoard(board, gameId) },
  );

  await ctx.answerCallbackQuery();
});

const runner = run(bot);
const stopRunner = () => runner.isRunning() && runner.stop();
process.once("SIGINT", stopRunner);
process.once("SIGTERM", stopRunner);
