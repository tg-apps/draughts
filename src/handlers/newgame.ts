import type { Context } from "grammy";
import type { Chat, Message, User } from "grammy/types";

import { db } from "#db";
import { games } from "#db/schema";
import { Board } from "#game/board";
import { upsertUser, getUserDisplayName } from "#utils/user";

export async function handleNewgame(
  ctx: Context & { from: User; chat: Chat },
): Promise<Message.TextMessage> {
  upsertUser(ctx.from);

  const initialBoard = new Board();
  const newGame = db
    .insert(games)
    .values({
      chatId: ctx.chat.id,
      board: JSON.stringify(initialBoard),
      whitePlayer: ctx.from.id,
      turn: "white",
      status: "playing",
    })
    .returning({ id: games.id })
    .get();

  const whitePlayerName = getUserDisplayName(ctx.from.id);

  return await ctx.reply(
    `Игра началась!\nБелые: ${whitePlayerName}\n\nХод: Белые ⚪`,
    { reply_markup: initialBoard.render(newGame.id) },
  );
}
