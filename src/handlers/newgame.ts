import type { Context } from "grammy";
import type { Chat, Message, User } from "grammy/types";

import { db } from "#db";
import { games } from "#db/schema";
import { Board } from "#game/board";

export async function handleNewgame(
  ctx: Context & { from: User; chat: Chat },
): Promise<Message.TextMessage> {
  const initialBoard = new Board();
  const [newGame] = await db
    .insert(games)
    .values({
      chatId: ctx.chat.id,
      board: JSON.stringify(initialBoard),
      whitePlayer: ctx.from.id,
      turn: "white",
      status: "playing",
    })
    .returning({ id: games.id });

  if (!newGame) throw new Error("Failed to create new game");

  return await ctx.reply(
    `Игра началась!\nБелые: ${ctx.from.first_name}\nЧерные: ожидаем хода противника...`,
    { reply_markup: initialBoard.render(newGame.id) },
  );
}
