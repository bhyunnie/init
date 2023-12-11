import { REST, Routes } from "discord.js";
import loadCommands from "./loadCommands.js";
import { clog, cerror } from "../../util/log.js";
import ENV from "../../config/env.js";

const deploy = async () => {
  clog("============ (/) 명령어 배포 ============");
  const rest = new REST().setToken(ENV.DISCORD_BOT_TOKEN);

  const commands = [...loadCommands.commands];

  try {
    clog(`🚀 ${commands.length} 개의 (/) 명령어 배포 시작`);

    // 명령어 전부 수정 들어감
    const data = await rest.put(
      Routes.applicationGuildCommands(
        ENV.DISCORD_BOT_APPLICATION_ID,
        ENV.DISCORD_SERVER_ID
      ),
      {
        body: commands,
      }
    );
    clog(`✅ ${data.length} 개의 (/) 명령어 배포 완료\n`);
  } catch (error) {
    cerror(error);
  }
};

export default { deploy };
