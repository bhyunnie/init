import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  hideLinkEmbed,
} from "discord.js";
import { db } from "../../../db/db.js";
import Markdown from "../../util/markdown.js";

const updatePosition = async (interaction) => {
  const user = interaction.user;
  await db.query(
    `update user_profile set position = '${interaction.values[0]}' where user_id = '${user.id}'`
  );
  const embed = new EmbedBuilder()
    .setColor(0xe499fa)
    .setTitle(`입국 심사 2단계`)
    .setDescription(`🗓️ 경력이 얼마나 되셨나요?`)
    .addFields({
      name: Markdown.blank(),
      value: `🔖 추후 수정이 가능한 정보입니다.
        만으로 근무한 년수가 아닌, 햇수로 따집니다.
        e.g) 만 1년 7개월 근무 => 2년차
        `,
    });
  const select = new StringSelectMenuBuilder()
    .setCustomId("signupCareer")
    .setPlaceholder("⚙️ 경력을 선택해주세요")
    .addOptions(
      setSelectMenuOption("경력 없음", "🍼 학생, 구직 중 입니다.", "NEW")
    );
  for (let i = 1; i <= 20; i++) {
    select.addOptions(
      setSelectMenuOption(
        `${i}년 차`,
        `${i <= 5 ? "🌱" : i <= 10 ? "🌿" : "🌻"}${
          i - 1
        } 년 0 ~ 11 개월의 경력입니다.`,
        i.toString()
      )
    );
  }
  const row = new ActionRowBuilder().addComponents(select);
  await interaction.reply({
    embeds: [embed],
    components: [row],
    ephemeral: true,
  });
};

const updateCareer = async (interaction) => {
  const user = interaction.user;
  await db.query(
    `update user_profile set career = ${interaction.values[0]} where user_id = '${user.id}'`
  );
  const embed = new EmbedBuilder()
    .setColor(0xe499fa)
    .setTitle(`입국 심사 3단계`)
    .setDescription(
      `📚 다양한 API를 연동하기 위한 API KEY , 혹은 닉네임, 아이디를 선택적으로 제공 받고있습니다.`
    )
    .addFields({
      name: "🕐 WAKATIME 연동하기",
      value: `${hideLinkEmbed(
        "https://wakatime.com/settings/account"
      )}\n 위 링크에 접속하여 SECRET API KEY 를 가져와 주시면 됩니다.`,
    })
    .addFields({
      name: "🐙 GITHUB 연동하기",
      value: `${hideLinkEmbed(
        "https://github.com"
      )}\n깃허브에서 사용하는 닉네임 (로그인아이디X, 이름X)`,
    })
    .addFields({
      name: Markdown.blank(),
      value: `🔖 추후 수정이 가능한 정보입니다.
      `,
    });

  const confirmButton = new ButtonBuilder()
    .setCustomId("confirmSubmitAPIKey")
    .setStyle(ButtonStyle.Secondary)
    .setLabel("✍️ 연동 정보 제공하기");

  const rejectButton = new ButtonBuilder()
    .setCustomId("rejectSubmitAPIKey")
    .setStyle(ButtonStyle.Danger)
    .setLabel("💦 연동 없이 계속하기");

  const row = new ActionRowBuilder().addComponents(confirmButton, rejectButton);

  await interaction.reply({
    embeds: [embed],
    components: [row],
    ephemeral: true,
  });
};

const setSelectMenuOption = (label, description, value) => {
  return new StringSelectMenuOptionBuilder()
    .setLabel(label)
    .setDescription(description)
    .setValue(value);
};

export { updatePosition, updateCareer };
