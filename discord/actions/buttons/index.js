import { showNicknameEmbed } from "../show/embed.js";
import {
  signup,
  confirmInformationCollection,
  rejectInformationCollection,
  confirmSubmitAPIKey,
  confirmSubmitNickname,
} from "./signup.js";

const interactionWithButton = async (interaction) => {
  if (interaction.customId === "signup") return signup(interaction);
  if (interaction.customId === "confirmInformationCollection")
    return confirmInformationCollection(interaction);
  if (interaction.customId === "rejectInformationCollection")
    return rejectInformationCollection(interaction);
  if (interaction.customId === "confirmSubmitAPIKey")
    return confirmSubmitAPIKey(interaction);
  if (interaction.customId === "rejectSubmitAPIKey")
    return showNicknameEmbed(interaction);
  if (interaction.customId === "confirmSubmitNickname")
    return confirmSubmitNickname(interaction);
};

export { interactionWithButton };
