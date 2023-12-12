import { clog } from "../../util/log.js";
import client from "./client.js";
import { ActivityType, Events } from "discord.js";
import banner from "../../config/banner.js";
import discord from "../index.js";

const load = () => {
  client.once(Events.ClientReady, (readyClient) => {
    clog("✅ 디스코드 연동 완료");
    clog(`✅ 봇 계정 ${readyClient.user.tag} 활성화 완료`);
    discord.setCommand().then(() => {
      clog(banner);
    });
    client.user.setActivity("👀 딴 짓 하는지 감시 중", {
      type: ActivityType.Custom,
    });
  });
};

export default { load };
