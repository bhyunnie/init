import { Collection } from "discord.js";
import client from "./client.js";
import fs from "fs";
import path from "path";
import { dirname } from "../../util/path.js";
import { clog } from "../../util/log.js";
import ENV from "../../config/env.js";

const commands = [];
const showCommandList = ENV.DISCORD_COMMAND_LIST === "SHOW";

const load = async () => {
  const foldersPath = path.join(dirname, "discord/actions/commands");
  const commandFolders = fs
    .readdirSync(foldersPath)
    .filter((dir) => !dir.endsWith(".js"));

  client.commands = new Collection();

  if (showCommandList) clog("============ (/) 명령어 목록 ============");
  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));
    if (showCommandList) clog(`📁 ${folder}`);
    for (const file of commandFiles) {
      if (showCommandList) clog(`ㄴ 📜 ${file}`);
      const filePath = path.join(commandsPath, file);
      const fileURL = new URL(`file://${filePath}`);
      const command = await import(fileURL);

      // 콜렉션으로 set 해서 추가해야됨
      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
      } else {
        if (showCommandList)
          clog(`🚫 ${fileURL} 파일에 data || execute 가 정의 되어있지 않음`);
      }
    }
  }
  clog("✅ 명령어 파일 로드 완료\n");
};
export default { load, commands };
