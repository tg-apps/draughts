import { run } from "@grammyjs/runner";
import { Bot, GrammyError } from "grammy";

import { handleGameCallback } from "./handlers/game";
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
  if (data.startsWith("move:")) {
    return handleMoveCallback(ctx, data);
  }
  if (data.startsWith("game:")) {
    return handleGameCallback(ctx, data);
  }
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

void bot.api.setMyCommands([
  { command: "start", description: "Помощь о боте" },
  { command: "help", description: "Помощь о боте" },
  { command: "game", description: "Начать игру в шашки" },
  { command: "newgame", description: "Начать игру в шашки" },
  { command: "draughts", description: "Начать игру в шашки" },
]);

const runner = run(bot);
const stopRunner = () => runner.isRunning() && runner.stop();

process.once("SIGINT", stopRunner);
process.once("SIGTERM", stopRunner);
