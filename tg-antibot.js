const { Telegraf } = require("telegraf");

const CHAT_ID = parseInt(process.env.TG_CHAT_ID);
const TOKEN = process.env.TG_ANTIBOT_TOKEN;

if (!TOKEN || !CHAT_ID) {
  throw new Error(
    "TG_ANTIBOT_TOKEN and TG_CHAT_ID environment variables hasn't been set."
  );
}

const bot = new Telegraf(TOKEN);

bot.on("new_chat_members", (ctx) => {
  const message = ctx.message;
  console.log(message);
  const chatId = ctx.message.chat.id;
  if (chatId != CHAT_ID) {
    return;
  }

  const newUsers = ctx.message.new_chat_members;
  newUsers.forEach((user) => {
    const userId = user.id;
    const userFirstName = user.first_name;
    bot.telegram
      .restrictChatMember(chatId, userId, {
        can_send_messages: false,
        can_send_media_messages: false,
        can_send_polls: false,
        can_send_other_messages: false,
        can_add_web_page_previews: false,
        can_change_info: false,
        can_invite_users: false,
        can_pin_messages: false,
      })
      .then(() => {
        bot.telegram.sendMessage(
          chatId,
          `Welcome [${userFirstName}](tg://user?id=${userId})\\!\n\nPlease tell me what the color of snow is in a PM to prove that you're a human\\.`,
          { parse_mode: "MarkdownV2" }
        );
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  });
});

bot.hears(["white", "White", "vit", "Vit"], (ctx) => {
  const chatId = ctx.message.chat.id;
  if (chatId == CHAT_ID) {
    return;
  }

  bot.telegram
    .restrictChatMember(CHAT_ID, ctx.message.from.id, {
      can_send_messages: true,
      can_send_media_messages: true,
      can_send_polls: true,
      can_send_other_messages: true,
      can_add_web_page_previews: true,
      can_change_info: true,
      can_invite_users: true,
      can_pin_messages: true,
    })
    .then(() => {
      bot.telegram.sendMessage(chatId, "Correct\\!");
    });
});

bot.launch();
