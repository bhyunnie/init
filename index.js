import { Events } from "discord.js";
import { makeDBConnection } from "./db/db.js";
import client from "./discord/config/client.js";
import { clog, cerror } from "./util/log.js";
import discord from "./discord/index.js";

// TODO
// cron
// 등록할 커맨드 정리 필요
// 연동할 것들 정리 github, wakatime 등등

// SERVER SETTING
clog("============ 서버 설정 로드 ============");

// DB
await makeDBConnection();

// Discord Command Setting
discord.attachEventListeners();
discord.connectBot();

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    cerror(`${interaction.commandName} 이런 명령어는 존재하지 않아요 😢`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    cerror(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});
