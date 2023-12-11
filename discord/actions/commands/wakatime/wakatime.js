import { SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
  .setName("wakatime")
  .setDescription("wakatime 연동");

const execute = async (interaction) => {
  await interaction.reply("waka waka");
};
export { data, execute };
