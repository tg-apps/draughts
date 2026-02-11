import { run } from "@grammyjs/runner";
import { Bot, GrammyError } from "grammy";

import { handleHelp } from "./handlers/help";
import { handleMoveCallback } from "./handlers/move";
import { handleNewgame } from "./handlers/newgame";

const TOKEN = process.env["TOKEN"];
if (!TOKEN) throw new Error("Missing TOKEN env variable");

const bot = new Bot(TOKEN);

bot.on("message").command(["start", "help"], handleHelp);
bot.on("message").command(["newgame", "game", "draughts"], handleNewgame);
bot.on("callback_query:data", (ctx) => {
  const data = ctx.callbackQuery.data;
  if (!data.startsWith("move:")) return;
  return handleMoveCallback(ctx, data);
});

bot.catch(({ ctx, error }) => {
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  if (error instanceof GrammyError) {
    if (error.method === "editMessageReplyMarkup") return;
    console.error(`Error in request (${error.method}): ${error.description}`);
    return;
  }
  console.error("Unknown error:", error);
});

const runner = run(bot);
const stopRunner = () => runner.isRunning() && runner.stop();

process.once("SIGINT", stopRunner);
process.once("SIGTERM", stopRunner);
