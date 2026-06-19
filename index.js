const express = require("express");
const path = require("path");
const { Telegraf } = require("telegraf");

const app = express();
app.use(express.json());

// ======================
// 🤖 BOT (ХАРДКОД)
// ======================
const bot = new Telegraf("8695065233:AAESdJ3FycIWvRVv9LDmydCh_TMi8PizT6k");

// ======================
// 🌐 LINKS (ХАРДКОД)
// ======================
const BASE_URL = "https://solorewardsbot-production.up.railway.app";
const WEBAPP_URL = BASE_URL + "/webapp";

// ======================
// 🟢 HEALTH CHECK
// ======================
app.get("/", (req, res) => {
  res.send("Solo Rewards API OK");
});

// ======================
// 🌐 MINI APP
// ======================
app.use("/webapp", express.static(path.join(__dirname, "webapp")));

app.get("/webapp", (req, res) => {
  res.sendFile(path.join(__dirname, "webapp", "index.html"));
});

// ======================
// 🤖 START COMMAND
// ======================
bot.start((ctx) => {
  return ctx.reply("🚀 Solo Rewards", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🎁 Открыть приложение",
            web_app: { url: WEBAPP_URL },
          },
        ],
      ],
    },
  });
});

// ======================
// 🔐 WEBHOOK
// ======================
app.post("/telegram-webhook", async (req, res) => {
  try {
    await bot.handleUpdate(req.body);
    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(200);
  }
});

// ======================
// 🚀 START SERVER
// ======================
const PORT = 8080;

app.listen(PORT, async () => {
  console.log("Server running on", PORT);

  try {
    const webhookUrl = BASE_URL + "/telegram-webhook";

    await bot.telegram.setWebhook(webhookUrl);

    console.log("Webhook set:", webhookUrl);
  } catch (e) {
    console.error("Webhook setup error:", e);
  }
});
