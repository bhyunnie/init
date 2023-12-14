import {
  signup,
  confirmInformationCollection,
  rejectInformationCollection,
} from "./signup.js";

const interactionWithButton = async (interaction) => {
  if (interaction.customId === "signup") return signup(interaction);
  if (interaction.customId === "confirmInformationCollection")
    return confirmInformationCollection(interaction);
  if (interaction.customId === "rejectInformationCollection")
    return rejectInformationCollection(interaction);
};

export { interactionWithButton };
