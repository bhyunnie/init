import { makeDBConnection } from "./db/db.js";
import { clog } from "./util/log.js";
import discord from "./discord/index.js";
import { setRankScheduler } from "./discord/scheduler/index.js";

// SERVER SETTING
clog("============ 서버 설정 로드 ============");

// DB
await makeDBConnection();

// Discord Command Setting
discord.attachEventListeners();
await discord.connectBot();

// scheduler
setRankScheduler();
