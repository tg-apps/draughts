import { run } from "@grammyjs/runner";
import { Bot } from "grammy";

import { handleQueryCallback } from "./handlers/move";
import { handleStart } from "./handlers/start";

const TOKEN = process.env["TOKEN"];
if (!TOKEN) throw new Error("Missing TOKEN env variable");

const bot = new Bot(TOKEN);

bot.on("message").command("start", handleStart);
bot.on("callback_query:data", handleQueryCallback);

const runner = run(bot);
const stopRunner = () => runner.isRunning() && runner.stop();
process.once("SIGINT", stopRunner);
process.once("SIGTERM", stopRunner);
