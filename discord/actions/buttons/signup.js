import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import client from "../../config/client.js";
import Markdown from "../../util/markdown.js";
import { db } from "../../../db/db.js";

const signup = async (interaction) => {
  const user = interaction.user;
  const userInfo = await client.users.fetch(user.id);
  const userProfileImageURL = userInfo.displayAvatarURL({
    format: "png",
    dynamic: true,
  });

  const embed = new EmbedBuilder()
    .setColor(0xe499fa)
    .setTitle(
      `✈️ ${interaction.user.username} 님의 입국심사 프로세스를 시작 하겠습니다.`
    )
    .setDescription(
      `서버를 이용하기 위한 간단한 프로세스 입니다.
    아래의 설명에 따라 잘 기입해주시면 감사하겠습니다.`
    )
    .setThumbnail(userProfileImageURL)
    .addFields({
      name: Markdown.blank(),
      value: "🔖 다음과 같은 정보를 수집합니다.",
    })
    .addFields({
      name: "✨ 필수 항목",
      value: Markdown.bold(Markdown.list(["닉네임", "포지션", "경력"])),
    })
    .addFields({
      name: "⚙️ 선택 사항",
      value: Markdown.bold(Markdown.list(["WAKATIME API KEY", "GITHUB ID"])),
    })
    .addFields({
      name: Markdown.blank(),
      value: Markdown.bold("📢 위 정보의 수집에 동의하시나요?"),
    });

  const confirmButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Success)
    .setLabel("❤️ 동의 합니다")
    .setCustomId("confirmInformationCollection");

  const rejectButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Danger)
    .setLabel("💦 동의하지 않습니다.")
    .setCustomId("rejectInformationCollection");

  const row = new ActionRowBuilder().addComponents(confirmButton, rejectButton);

  await interaction.reply({
    embeds: [embed],
    components: [row],
    ephemeral: true,
  });
};

const confirmInformationCollection = async (interaction) => {
  const user = interaction.user;
  const userId = user.id;
  const result = await db.query(
    `select * from users where user_id = '${userId}'`
  );
  const data = result.rows[0];

  if (data?.nickname) {
    interaction.reply({
      content: "이미 가입된 정보가 있습니다",
      ephemeral: true,
    });
  } else {
  }
};

const rejectInformationCollection = (interaction) => {
  interaction.reply({
    content: "압도적 슬픔",
    ephemeral: true,
  });
};

export { signup, confirmInformationCollection, rejectInformationCollection };
