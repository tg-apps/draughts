import type { Context } from "grammy";
import type { Message, User } from "grammy/types";

export async function handleHelp(
  ctx: Context & { from: User },
): Promise<Message.TextMessage> {
  return await ctx.reply(
    "Напиши /draughts чтобы начать новую игру в шашки за белых",
  );
}
