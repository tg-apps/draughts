import { eq } from "drizzle-orm";
import { InlineKeyboard } from "grammy";
import type { Context } from "grammy";
import type { User } from "grammy/types";

import { db } from "#db";
import { games } from "#db/schema";
import { Board } from "#game/board";
import { getUserDisplayName } from "#utils/user";

type GameAction = "resign" | "draw";

function parseData(data: string): {
  action: GameAction;
  gameId: number;
  confirmed?: boolean;
  cancelled?: boolean;
  offererId?: number;
} | null {
  const parts = data.split(":");
  if (parts.length < 3 || parts.length > 5) return null;

  const action = parts[1];
  if (action !== "resign" && action !== "draw") return null;

  const gameIdStr = parts[2];
  if (!gameIdStr) return null;
  const gameId = parseInt(gameIdStr);
  if (Number.isNaN(gameId)) return null;

  const confirmed = parts[3] === "confirm" ? true : undefined;
  const cancelled = parts[3] === "cancel" ? true : undefined;

  let offererId: number | undefined;
  if (parts[4]) {
    offererId = parseInt(parts[4]);
    if (Number.isNaN(offererId)) offererId = undefined;
  }

  return { action, gameId, confirmed, cancelled, offererId };
}

function isPlayer(
  game: { whitePlayer: number; blackPlayer: number | null },
  userId: number,
) {
  return userId === game.whitePlayer || userId === game.blackPlayer;
}

function getCurrentPlayerName(
  game: { whitePlayer: number; blackPlayer: number | null },
  perspective: string,
) {
  return perspective === "white"
    ? getUserDisplayName(game.whitePlayer)
    : game.blackPlayer
      ? getUserDisplayName(game.blackPlayer)
      : "???";
}

function getOpponentName(
  game: { whitePlayer: number; blackPlayer: number | null },
  perspective: string,
) {
  return perspective === "white"
    ? game.blackPlayer
      ? getUserDisplayName(game.blackPlayer)
      : "ожидание соперника"
    : getUserDisplayName(game.whitePlayer);
}

export async function handleGameCallback(
  ctx: Context & { from: User },
  data: string,
): Promise<true> {
  const parsed = parseData(data);
  if (!parsed) return await ctx.answerCallbackQuery("Неверный формат данных");

  const { action, gameId, confirmed, cancelled, offererId } = parsed;
  const userId = ctx.from.id;

  const game = await db.query.games.findFirst({
    where: (games, { eq }) => eq(games.id, gameId),
  });
  if (!game) return await ctx.answerCallbackQuery("Игра не найдена");

  if (game.status !== "playing") {
    return await ctx.answerCallbackQuery("Игра уже окончена!");
  }

  if (!game.blackPlayer) {
    return await ctx.answerCallbackQuery("Соперник ещё не присоединился!");
  }

  if (!isPlayer(game, userId)) {
    return await ctx.answerCallbackQuery("Ты не участник этой игры!");
  }

  const board = Board.fromJSON(game.board);

  if (cancelled) {
    const moveInfoText = game.turn === "white" ? "Белые ⚪" : "Черные ⚫";
    const playersInfo = `Белые: ${getUserDisplayName(game.whitePlayer)}\nЧерные: ${getUserDisplayName(game.blackPlayer)}`;
    const messageText = `Ход: ${moveInfoText}\n\n${playersInfo}`;
    await ctx.editMessageText(messageText, {
      reply_markup: board.render(gameId, game.status),
    });
    return await ctx.answerCallbackQuery();
  }

  if (confirmed) {
    switch (action) {
      case "resign": {
        const winner = userId === game.whitePlayer ? "black" : "white";
        const winnerLabel = winner === "white" ? "Белые ⚪" : "Черные ⚫";

        const status = winner === "white" ? "white_won" : "black_won";

        await db.update(games).set({ status }).where(eq(games.id, gameId));

        await ctx.editMessageText(
          `🏳️ Игра окончена! ${getUserDisplayName(userId)} сдался.\n\nПобедили ${winnerLabel}!`,
          { reply_markup: board.render(gameId, status) },
        );
        return await ctx.answerCallbackQuery();
      }
      case "draw": {
        if (offererId !== game.whitePlayer && offererId !== game.blackPlayer) {
          return await ctx.answerCallbackQuery("Неверный формат данных");
        }
        if (userId === offererId) {
          return await ctx.answerCallbackQuery(
            "Вы не можете принять собственное предложение!",
          );
        }
        const otherPlayer =
          game.whitePlayer === offererId ? game.blackPlayer : game.whitePlayer;
        if (userId !== otherPlayer) {
          return await ctx.answerCallbackQuery("Ты не участник этой игры!");
        }

        await db
          .update(games)
          .set({ status: "draw" })
          .where(eq(games.id, gameId));

        await ctx.editMessageText(
          `🤝 Ничья! Игроки согласились на ничью.\n\nБелые: ${getUserDisplayName(game.whitePlayer)}\nЧерные: ${getUserDisplayName(game.blackPlayer)}`,
          { reply_markup: board.render(gameId, "draw") },
        );
        return await ctx.answerCallbackQuery();
      }
    }
  }

  const userColor = userId === game.whitePlayer ? "white" : "black";

  switch (action) {
    case "resign": {
      const opponentName = getOpponentName(game, userColor);
      const keyboard = new InlineKeyboard();
      keyboard.text("Да", `game:resign:${gameId}:confirm`);
      keyboard.text("Нет", `game:resign:${gameId}:cancel`);

      await ctx.editMessageText(
        `Вы уверены, что хотите сдаться?\n\nЕсли вы сдадитесь, победа присуждается ${opponentName}.`,
        { reply_markup: keyboard },
      );
      return await ctx.answerCallbackQuery();
    }
    case "draw": {
      const currentPlayerName = getCurrentPlayerName(game, userColor);
      const opponentName = getOpponentName(game, userColor);

      const keyboard = new InlineKeyboard();
      keyboard.text("Да", `game:draw:${gameId}:confirm:${userId}`);
      keyboard.text("Нет", `game:draw:${gameId}:cancel`);

      await ctx.editMessageText(
        `${currentPlayerName} предлагает ничью.\n\n${opponentName}, вы согласны на ничью?`,
        { reply_markup: keyboard },
      );
      return await ctx.answerCallbackQuery();
    }
  }
}
