import { cerror, clog } from "../../util/log.js";
import client from "./client.js";
import {
  ActionRowBuilder,
  ActivityType,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Events,
} from "discord.js";
import banner from "../../config/banner.js";
import discord from "../index.js";
import ENV from "../../config/env.js";
import { interactionWithSlashCommand } from "../actions/commands/index.js";
import { interactionWithButton } from "../actions/buttons/index.js";
import { interactionWithSelectMenu } from "../actions/selectMenus/index.js";
import { interactionWithModal } from "../actions/modals/index.js";
import { sendWelcomeMessage } from "../actions/send/onboard.js";

// ================= 호출부 ==================

const load = () => {
  clientReady();
  interactionEvent();
  guildMemberAdd();
};

// ================= 이벤트 정의 ==================
// 상호작용 발생
const interactionEvent = () => {
  // 상호작용 생성시
  client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) {
      return interactionWithSlashCommand(interaction);
    }

    if (interaction.isButton()) {
      return interactionWithButton(interaction);
    }

    if (interaction.isAnySelectMenu()) {
      return interactionWithSelectMenu(interaction);
    }

    if (interaction.isModalSubmit()) {
      return interactionWithModal(interaction);
    }

    interaction.reply({
      content: "⚠️ 아직 이런거 없삼",
    });
  });
};

// 봇 로그인 시
const clientReady = () => {
  client.once(Events.ClientReady, async (readyClient) => {
    clog("✅ 디스코드 연동 완료");
    clog(`✅ 봇 계정 ${readyClient.user.tag} 활성화 완료`);
    discord.setCommand().then(() => {
      clog(banner);
    });
    client.user.setActivity("👀 딴 짓 하는지 감시 중", {
      type: ActivityType.Custom,
    });
    // await sendWelcomeMessage();
  });
};

// 새로운 멤버 추가 시
const guildMemberAdd = () => {
  client.on("guildMemberAdd", async (member) => {
    await member.setNickname("👋 환영합니다");
    await member.roles.add(ENV.DISCORD_ROLE_NOMAD);
  });
};

export default { load };
