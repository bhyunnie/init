import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { db } from "../../../../db/db.js";
import client from "../../../config/client.js";

const data = new SlashCommandBuilder()
  .setName("프로필수정")
  .setDescription("🚧 내 프로필 수정");

// SQL Injection 방지 들어가야됨
// 쿼리를 다이나믹 쿼리로 사용할 순 없을까 방법 생각
const execute = async (interaction) => {
  const user = interaction.user;
  const result = await db.query(
    `select * from users u left join api_sync api on u.user_id = api.user_id where u.user_id = '${user.id}'`
  );
  const data = result.rows[0];
  const userInfo = await client.users.fetch(user.id);
  const userProfileImageURL = userInfo.displayAvatarURL({
    format: "png",
    dynamic: true,
  });
  const embed = new EmbedBuilder()
    .setColor(0xe499fa)
    .setTitle(`✨ ${data.nickname} 님의 프로필`)
    .setDescription("현재 정보입니다.")
    .setThumbnail(userProfileImageURL)
    .addFields(
      { name: "🔖 닉네임", value: `<@${data.user_id}>` },
      { name: "🗓️ 가입일", value: `${data.created_at}` },
      { name: "🕑 Wakatime", value: `${data.wakatime_api_key}` },
      {
        name: "🐙 Github",
        value: `${data.github_id || "아직 아이디를 입력하지 않았어요. 😢"}`,
      }
    );

  await interaction.reply({ embeds: [embed], ephemeral: true });
};

export { data, execute };
