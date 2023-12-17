import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import ENV from "../../../config/env.js";
import client from "../../config/client.js";
import markdown from "../../util/markdown.js";

// 입장 시 메세지
const sendWelcomeMessage = async () => {
  const channel = client.channels.cache.get(ENV.DISCORD_ONBOARD_CHANNEL_ID);
  const serverImageURL = client.guilds.cache
    .get(ENV.DISCORD_SERVER_ID)
    .iconURL({ format: "png", dynamic: true });
  const roleNomad = client.guilds.cache
    .get(ENV.DISCORD_SERVER_ID)
    .roles.cache.find((role) => role.id === ENV.DISCORD_ROLE_NOMAD);
  const signup = new ButtonBuilder()
    .setStyle(ButtonStyle.Primary)
    .setLabel(`🎁 서버 가입`)
    .setCustomId("signup");

  const embed = new EmbedBuilder()
    .setColor(0xe499fa)
    .setTitle("🚀 Immigration.init()")
    .setDescription(
      `${markdown.blank()}
        🙂 처음 오신 ${roleNomad} 여러분 환영합니다!!
          
          😘 Init 서버는 스터디 서버입니다.
  
          😢 아직은 부족한 점이 많지만 꾸준히 관리하도록 하겠습니다.
  
          😎 불편사항은 dev.bhyunnie@gmail.com 로 연락주시거나 관리자에게 말씀 해주시면 됩니다.
          ${markdown.blank()}
          `
    )
    .setThumbnail(serverImageURL)
    .addFields(
      { name: "만든이", value: `<@${ENV.DISCORD_MASTER_ID}>`, inline: true },
      { name: "관리자", value: `<@${ENV.DISCORD_MASTER_ID}>`, inline: true }
    );

  const row = new ActionRowBuilder().addComponents(signup);
  channel.send({ embeds: [embed], components: [row] });
};

export { sendWelcomeMessage };
