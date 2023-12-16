import { updateCareer, updatePosition } from "./signup.js";

const interactionWithSelectMenu = async (interaction) => {
  if (interaction.customId === "signupPosition") updatePosition(interaction);
  if (interaction.customId === "signupCareer") updateCareer(interaction);
};

export { interactionWithSelectMenu };
