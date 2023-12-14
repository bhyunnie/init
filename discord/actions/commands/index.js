import { cerror } from "../../../util/log.js";

const interactionWithSlashCommand = async (interaction) => {
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    cerror(`${interaction.commandName} 이런 명령어는 존재하지 않아요 😢`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    cerror(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "에러가 발생했어요!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "에러가 발생했어요!",
        ephemeral: true,
      });
    }
  }
};

export { interactionWithSlashCommand };
