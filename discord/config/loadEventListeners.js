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
  client.once(Events.ClientReady, (readyClient) => {
    clog("✅ 디스코드 연동 완료");
    clog(`✅ 봇 계정 ${readyClient.user.tag} 활성화 완료`);
    discord.setCommand().then(() => {
      clog(banner);
    });
    client.user.setActivity("👀 딴 짓 하는지 감시 중", {
      type: ActivityType.Custom,
    });
  });
};

// 새로운 멤버 추가 시
const guildMemberAdd = () => {
  client.on("guildMemberAdd", async (member) => {
    // await sendWelcomeMessage(member);
    await member.setNickname("👋 환영합니다");
    await member.roles.add(ENV.DISCORD_ROLE_NOMAD);
  });
};

// 입장 시 메세지
const sendWelcomeMessage = async (member) => {
  const channelId = ENV.DISCORD_ONBOARD_CHANNEL_ID;
  const channel = member.guild.channels.cache.get(channelId);
  const serverImageURL = client.guilds.cache
    .get(ENV.DISCORD_SERVER_ID)
    .iconURL({ format: "png", dynamic: true });
  const masterUser = await client.users.fetch(ENV.DISCORD_MASTER_ID);
  const masterUserProfileImageURL = masterUser.displayAvatarURL({
    format: "png",
    dynamic: true,
  });
  const signup = new ButtonBuilder()
    .setStyle(ButtonStyle.Primary)
    .setLabel(`✍️ 정보 기입`)
    .setCustomId("signup");

  const embed = new EmbedBuilder()
    .setColor(0xe499fa)
    .setTitle("Immigration.init()")
    .setDescription(
      `🙂 처음 오신 여러분 환영합니다!!
        
        😘 Init 서버는 유출 되어도 전혀 문제가 되지 않는 값들만 수집합니다.

        😢 개인적으로 사용하려고 만든 것이어서 부족한 점이 많습니다.

        😎 버그제보 dev.bhyunnie@gmail.com
        `
    )
    .setThumbnail(serverImageURL)
    .addFields(
      { name: "만든이", value: `<@${ENV.DISCORD_MASTER_ID}>`, inline: true },
      { name: "관리자", value: `<@${ENV.DISCORD_MASTER_ID}>`, inline: true }
    )
    .setTimestamp()
    .setFooter({
      text: "All Reserved deb.bhyunnie@gmail.com",
      iconURL: masterUserProfileImageURL,
    });

  const row = new ActionRowBuilder().addComponents(signup);
  channel.send({ embeds: [embed], components: [row] });
};

export default { load };
