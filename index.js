const express = require("express");
const path = require("path");
const bot = require("./bot");
const db = require("./db");
require("dotenv").config();

const app = express();

// ❗ Railway сам даёт порт
const PORT = process.env.PORT;

app.use(express.json());

// Mini App static
app.use("/webapp", express.static(path.join(__dirname, "webapp")));

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

// BALANCE
app.get("/balance", (req, res) => {
  db.get(
    "SELECT coins FROM users WHERE telegram_id = ?",
    [req.query.user_id],
    (err, row) => {
      res.json({ coins: row?.coins || 0 });
    }
  );
});

// TASK
app.post("/check-task", (req, res) => {
  const { user_id, task } = req.body;

  db.get(
    "SELECT * FROM tasks WHERE telegram_id = ? AND task_name = ?",
    [user_id, task],
    (err, row) => {
      if (row) return res.json({ message: "already done" });

      db.run(
        "INSERT INTO tasks (telegram_id, task_name, completed) VALUES (?, ?, 1)",
        [user_id, task]
      );

      db.run(
        "INSERT OR IGNORE INTO users (telegram_id, coins) VALUES (?, 0)",
        [user_id]
      );

      db.run(
        "UPDATE users SET coins = coins + 100 WHERE telegram_id = ?",
        [user_id]
      );

      res.json({ message: "+100 coins" });
    }
  );
});

// START BOT
bot.launch();

// START SERVER
app.listen(PORT, () => {
  console.log("🚀 Server running on", PORT);
});