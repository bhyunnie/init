import ENV from "../config/env.js";
import { sendWelcomeMessage } from "./actions/send/onboard.js";
import client from "./config/client.js";
import deployCommands from "./config/deployCommands.js";
import loadCommands from "./config/loadCommands.js";
import loadEventListeners from "./config/loadEventListeners.js";

const setCommand = async () => {
  await loadCommands.load().then(async () => {
    await deployCommands.deploy();
  });
};

const connectBot = async () => {
  await client.login(ENV.DISCORD_BOT_TOKEN);
};

const attachEventListeners = () => {
  loadEventListeners.load();
};

export default { setCommand, connectBot, attachEventListeners };
