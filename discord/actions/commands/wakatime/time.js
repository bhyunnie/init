import { SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
  .setName("lastdate")
  .setDescription("어제 코딩 기록");

const execute = async (interaction) => {
  await interaction.reply("waka waka");
};
export { data, execute };
