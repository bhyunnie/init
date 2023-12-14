import { makeDBConnection } from "./db/db.js";
import { clog } from "./util/log.js";
import discord from "./discord/index.js";

// TODO
// cron
// 등록할 커맨드 정리 필요
// 연동할 것들 정리 github, wakatime 등등

// SERVER SETTING
clog("============ 서버 설정 로드 ============");

// DB
await makeDBConnection();

// Discord Command Setting
discord.attachEventListeners();
discord.connectBot();
