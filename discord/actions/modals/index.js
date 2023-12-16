import { updateAPIKeyModal, updateNicknameModal } from "./signup.js";

const interactionWithModal = (interaction) => {
  if (interaction.customId === "updateAPIKeyModal")
    return updateAPIKeyModal(interaction);
  if (interaction.customId === "updateNicknameModal")
    return updateNicknameModal(interaction);
};

export { interactionWithModal };
