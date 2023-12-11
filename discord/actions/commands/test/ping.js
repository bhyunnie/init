import { SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
  .setName("test")
  .setDescription("테스트 커맨드 입니다.");

const execute = async (interaction) => {
  await interaction.reply("test");
};
export { data, execute };
