import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  bold,
} from "discord.js";
import markdown from "../../util/markdown.js";

const showNicknameEmbed = async (interaction) => {
  const embed = new EmbedBuilder()
    .setColor(0xe499fa)
    .setTitle(`🥳 마지막 단계만 남았어요`)
    .setDescription(`화이팅!`)
    .addFields({
      name: "⚠️ 서버에서 사용하실 닉네임을 입력해주세요",
      value: `${bold("단 다음과 같은 조건들이 있습니다.")}\n${markdown.list([
        "영어 대소문자, 숫자를 포함한 2~10글자",
        "특수문자는 불가능해요",
        "추후에 수정이 가능합니다.",
      ])}`,
    });

  const confirmButton = new ButtonBuilder()
    .setCustomId("confirmSubmitNickname")
    .setStyle(ButtonStyle.Secondary)
    .setLabel("👋 닉네임 작성 후 이용 시작하기");

  const row = new ActionRowBuilder().addComponents(confirmButton);

  await interaction.reply({
    embeds: [embed],
    components: [row],
    ephemeral: true,
  });
};

export { showNicknameEmbed };
