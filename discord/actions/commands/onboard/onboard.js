import { SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
  .setName("입국")
  .setDescription("오늘 공부한 시간을 알려드립니다.");

const execute = async (interaction) => {
  await interaction.reply({
    content: `📖 오늘 총 ${hours}시간 ${minutes}분 공부하셨습니다.`,
    ephemeral: false,
  });
};
export { data, execute };
