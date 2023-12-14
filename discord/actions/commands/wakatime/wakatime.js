import axios from "axios";
import { SlashCommandBuilder } from "discord.js";
import { db } from "../../../../db/db.js";
import { getTimeYYYYMMDD } from "../../../../util/time.js";

const data = new SlashCommandBuilder()
  .setName("공부")
  .setDescription("오늘 공부한 시간을 알려드립니다.");

const execute = async (interaction) => {
  const user = interaction.user;
  const result = await db.query(
    `select * from api_sync where user_id = '${user.id}'`
  );
  const data = result.rows[0];

  if (!data || !data.wakatime_api_key) {
    await interaction.reply({
      content: "⚠️ 아직 WAKATIME 을 연동하지 않으셨습니다",
      ephemeral: true,
    });
    return;
  }

  const today = getTimeYYYYMMDD();
  const wakatime_result = await axios.get(
    `https://wakatime.com/api/v1/users/current/summaries?start=${today}&end=${today}&api_key=${data.wakatime_api_key}&paywalled=true`
  );

  const hours = wakatime_result.data.cumulative_total.digital.split(":")[0];
  const minutes = wakatime_result.data.cumulative_total.digital.split(":")[1];

  await interaction.reply({
    content: `📖 오늘 총 ${hours}시간 ${minutes}분 공부하셨습니다.`,
    ephemeral: false,
  });
};
export { data, execute };
