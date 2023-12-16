import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import client from "../../config/client.js";
import Markdown from "../../util/markdown.js";
import { db } from "../../../db/db.js";
import ENV from "../../../config/env.js";

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
  const result = await db.query(
    `select * from user_profile where user_id = '${user.id}'`
  );
  const data = result.rows[0];

  if (data?.position && data?.career && data?.nickname) {
    interaction.reply({
      content: "이미 가입된 정보가 있습니다",
      ephemeral: true,
    });
  } else {
    if (data?.user_id) {
      showUpdatePosition(interaction);
    } else {
      const res = await db.query(
        `insert into users (user_id, user_name, global_name) values ('${user.id}','${user.username}','${user.globalName}')`
      );
      if (res) {
        showUpdatePosition(interaction);
      }
    }
  }
};

const showUpdatePosition = async (interaction) => {
  const embed = new EmbedBuilder()
    .setColor(0xe499fa)
    .setTitle(`입국 심사 1단계`)
    .setDescription(
      `${Markdown.bold("⚙️ 포지션을 선택해주세요.")}\n목록에 없는 포지션은 <@${
        ENV.DISCORD_MASTER_ID
      }> 에게 말씀해주세요`
    )
    .addFields({
      name: Markdown.blank(),
      value:
        "🔖 추후 수정이 가능한 정보입니다. 비 개발직군은 비개발 (ND) 를 선택해주세요.",
    });

  const select = new StringSelectMenuBuilder()
    .setCustomId("signupPosition")
    .setPlaceholder("⚙️ 포지션을 선택해주세요")
    .addOptions(
      setSelectMenuOption("BE", "백엔드 개발", "BE"),
      setSelectMenuOption("FE", "프론트엔드 개발", "FE"),
      setSelectMenuOption("FS", "풀스택 개발", "FS"),
      setSelectMenuOption("PU", "퍼블리싱", "PU"),
      setSelectMenuOption("SC", "보안 개발", "SC"),
      setSelectMenuOption("PC", "PC 프로그램 개발", "PC"),
      setSelectMenuOption("AOS", "안드로이드 개발", "AOS"),
      setSelectMenuOption("IOS", "IOS 개발", "IOS"),
      setSelectMenuOption("OP", "데브옵스", "OP"),
      setSelectMenuOption("GM", "게임 개발", "GM"),
      setSelectMenuOption("ML", "인고지능 머신러닝", "ML"),
      setSelectMenuOption("DBA", "데이터 베이스 아키텍쳐", "DBA"),
      setSelectMenuOption("DE", "데이터 엔지니어링", "DE"),
      setSelectMenuOption("IOT", "사물인터넷, 임베디드 개발", "IOT"),
      setSelectMenuOption("ETC", "기타 개발직군", "ETC"),
      setSelectMenuOption("YET", "현재 진로 미정", "YET"),
      setSelectMenuOption("ND", "비 개발직군", "ND")
    );

  const row = new ActionRowBuilder().addComponents(select);
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

const rejectInformationCollection = (interaction) => {
  interaction.reply({
    content: "압도적 슬픔",
    ephemeral: true,
  });
};

const confirmSubmitAPIKey = (interaction) => {
  const modal = new ModalBuilder()
    .setCustomId("updateAPIKeyModal")
    .setTitle("입국 심사 4단계");

  const wakatimeInput = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId("updateAPIKeyWakatime")
      .setLabel("🕐 Wakatime API Key를 입력해주세요.")
      .setPlaceholder("미연동 희망 시 비워두시면 됩니다.")
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
  );

  const githubInput = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId("updateAPIKeyGithub")
      .setLabel("🐙 Github 닉네임을 입력해주세요.")
      .setPlaceholder("미연동 희망 시 비워두시면 됩니다.")
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
  );

  modal.addComponents(wakatimeInput, githubInput);

  interaction.showModal(modal);
};

const confirmSubmitNickname = (interaction) => {
  const modal = new ModalBuilder()
    .setCustomId("updateNicknameModal")
    .setTitle("입국 심사 마지막단계");

  const nicknameInput = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId("updateNickname")
      .setLabel("📢 Init 서버에서 사용하실 닉네임을 입력해주세요.")
      .setPlaceholder("특수문자를 제외한 영어 대소문자 2~10글자")
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setMinLength(2)
      .setMaxLength(10)
  );
  modal.addComponents(nicknameInput);
  interaction.showModal(modal);
};

export {
  signup,
  confirmInformationCollection,
  rejectInformationCollection,
  confirmSubmitAPIKey,
  confirmSubmitNickname,
};
