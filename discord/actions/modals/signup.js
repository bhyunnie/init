import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  bold,
} from "discord.js";
import markdown from "../../util/markdown.js";
import ENV from "../../../config/env.js";
import { clog } from "../../../util/log.js";
import { db } from "../../../db/db.js";
import validation from "./util/validation.js";
import { showNicknameEmbed } from "../show/embed.js";
import client from "../../config/client.js";

const updateAPIKeyModal = async (interaction) => {
  try {
    const user = interaction.user;
    const wakatimeInputValue = interaction.fields.getTextInputValue(
      "updateAPIKeyWakatime"
    );
    const githubInputValue =
      interaction.fields.getTextInputValue("updateAPIKeyGithub");

    const wakatime_validate = validation.isWakatimeApiKey(wakatimeInputValue);
    const github_validate = await validation.isGithubNickname(githubInputValue);

    if (!wakatime_validate) {
      const embed = new EmbedBuilder()
        .setTitle("⚠️ 오류 발생")
        .setDescription("제출 시 문제가 발생했습니다.")
        .setColor(0xe499fa)
        .addFields({
          name: markdown.blank(),
          value: `<@${user.id}>\n❌ 잘못된 형식의 WAKATIME API 키 값입니다.\n아래의 빨간 네모 안의 waka로 시작하는 값입니다.\n해결이 되지 않는다면 <@${ENV.DISCORD_MASTER_ID}> 에게 문의 바랍니다.`,
        })
        .setImage(
          "https://private-user-images.githubusercontent.com/129918927/291004983-e729d892-c1ad-4a4a-8480-6c3a631f5014.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTEiLCJleHAiOjE3MDI3NDkwNDEsIm5iZiI6MTcwMjc0ODc0MSwicGF0aCI6Ii8xMjk5MTg5MjcvMjkxMDA0OTgzLWU3MjlkODkyLWMxYWQtNGE0YS04NDgwLTZjM2E2MzFmNTAxNC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBSVdOSllBWDRDU1ZFSDUzQSUyRjIwMjMxMjE2JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDIzMTIxNlQxNzQ1NDFaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0zNjE2YmYzYTYyODFmZTEwNzU0OWNlYzM0MjQ1ZjQyNjczNGU0MTk4ZmJjOTNjN2E0M2E5ZmQ2YmJhZmRkOGMxJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.fiizlLQmPVQEkIepqv4BDvYOOWYQH7YSfe2DYP_sL9c"
        );
      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    if (!github_validate) {
      const embed = new EmbedBuilder()
        .setTitle("⚠️ 오류 발생")
        .setDescription("제출 시 문제가 발생했습니다.")
        .setColor(0xe499fa)
        .addFields({
          name: markdown.blank(),
          value: `<@${user.id}>\n❌ 존재하지 않는 깃허브 닉네임입니다.\n아래의 빨간 네모 안의 닉네임입니다.\n해결이 되지 않는다면 <@${ENV.DISCORD_MASTER_ID}> 에게 문의 바랍니다.`,
        })
        .setImage(
          "https://private-user-images.githubusercontent.com/129918927/291002548-cbe8d18c-03fe-4000-9e48-7258c64191d7.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTEiLCJleHAiOjE3MDI3NDkwMDcsIm5iZiI6MTcwMjc0ODcwNywicGF0aCI6Ii8xMjk5MTg5MjcvMjkxMDAyNTQ4LWNiZThkMThjLTAzZmUtNDAwMC05ZTQ4LTcyNThjNjQxOTFkNy5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBSVdOSllBWDRDU1ZFSDUzQSUyRjIwMjMxMjE2JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDIzMTIxNlQxNzQ1MDdaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1lYjAzZmNmODEzNDk0MDM3ODVkZTgyZTQxZDk4MDA0MjExZTA1MzI3Yjk0NjIwNmMxYTFjNmFhZTRlZjE0ZmQxJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.OL-0pwRtfmzCTWqyix25wiYWIehBXh4l90_GinAT90U"
        );

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    const result = await db.query(
      `update api_sync set wakatime_api_key = '${wakatimeInputValue}',github_id='${githubInputValue}' where user_id = '${user.id}'`
    );
    console.log(result.rows[0]);
    await showNicknameEmbed(interaction);
  } catch (error) {
    clog(error);
  }
};

const updateNicknameModal = async (interaction) => {
  const user = interaction.user;
  const nicknameInput = interaction.fields.getTextInputValue("updateNickname");
  const nickname_validate = validation.isNickname(nicknameInput);

  if (!nickname_validate) {
    const embed = new EmbedBuilder()
      .setTitle("⚠️ 오류 발생")
      .setDescription("제출 시 문제가 발생했습니다.")
      .setColor(0xe499fa)
      .addFields({
        name: markdown.blank(),
        value: `<@${
          user.id
        }>\n❌ 사용 불가능한 닉네임입니다.\n아래의 형식에 맞춰 작성부탁드립니다.\n\n${markdown.list(
          [
            "영어 대소문자, 숫자를 포함한 2~10글자",
            "특수문자는 불가능해요",
            "추후에 수정이 가능합니다.",
          ]
        )}\n\n해결이 되지 않는다면 <@${
          ENV.DISCORD_MASTER_ID
        }> 에게 문의 바랍니다.`,
      });

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
    return;
  }

  const result = await db.query(
    `select nickname from user_profile where nickname = '${nicknameInput}'`
  );
  if (result.rowCount > 0) {
    const embed = new EmbedBuilder()
      .setTitle("⚠️ 오류 발생")
      .setDescription("제출 시 문제가 발생했습니다.")
      .setColor(0xe499fa)
      .addFields({
        name: markdown.blank(),
        value: `<@${user.id}>\n😢 누군가 사용중인 닉네임입니다.\n새로운 아이디를 작성부탁드립니다.\n\n해결이 되지 않는다면 <@${ENV.DISCORD_MASTER_ID}> 에게 문의 바랍니다.`,
      });

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
    return;
  } else {
    await db.query(
      `update user_profile set nickname = '${nicknameInput}' where user_id = '${user.id}'`
    );

    const result = await db.query(
      `select display_name from users where user_id = '${user.id}'`
    );
    const data = result.rows[0];

    const guild = client.guilds.cache.get(ENV.DISCORD_SERVER_ID);
    const member = guild.members.cache.get(user.id);

    await member.setNickname(data.display_name);

    const embed = new EmbedBuilder()
      .setTitle("🎉 가입을 축하드립니다!!!")
      .setDescription(`Init은 <@${user.id}> 님의 밝은 앞날을 응원합니다`)
      .setColor(0xe499fa)
      .addFields({
        name: markdown.blank(),
        value: `이용중에 불편함이 있다면 언제든지 <@${ENV.DISCORD_MASTER_ID}> 에게 문의 바랍니다.`,
      });

    await member.roles.remove(ENV.DISCORD_ROLE_NOMAD);
    await member.roles.add(ENV.DISCORD_ROLE_INITIATOR);
    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  }
  return;
};

export { updateAPIKeyModal, updateNicknameModal };
