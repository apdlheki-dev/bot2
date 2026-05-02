const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// 🧠 ذاكرة بسيطة (مؤقتة)
const memory = {};

// /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "👋 أهلاً! أنا بوت ذكاء اصطناعي متطور.\nاكتب أي سؤال أو أرسل صورة 🤖"
  );
});

// /help
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "🧠 الأوامر:\n/start\n/help\n\nأو اكتب أي سؤال مباشر"
  );
});

// 🖼️ استقبال الصور
bot.on("photo", async (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "📸 استلمت الصورة، أفكر بيها...");

  bot.sendMessage(chatId, "حالياً ما عندي تحليل صور متقدم، لكن أقدر أطورها لاحقاً 👍");
});

// 🤖 الرد الذكي
bot.on("message", async (msg) => {
  if (!msg.text || msg.text.startsWith("/")) return;

  const chatId = msg.chat.id;

  // حفظ آخر رسالة (ذاكرة بسيطة)
  memory[chatId] = msg.text;

  try {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          { role: "system", content: "أنت مساعد ذكي مفيد واحترافي." },
          { role: "user", content: msg.text }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = res.data.choices[0].message.content;

    bot.sendMessage(chatId, reply);

  catch (err) {
  console.log("ERROR:", err);
  bot.sendMessage(chatId, "صار خطأ 😕 تأكد من الإعدادات أو الـ API");
}
