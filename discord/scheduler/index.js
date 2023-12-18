// CRONTAB
import cron from "node-cron";
import client from "../config/client.js";
import ENV from "../../config/env.js";
import { EmbedBuilder } from "discord.js";
import {
  getTimeYYYYMMDD,
  getTimeYYYYMMDDHHMMSS,
  secondToHHMM,
} from "../../util/time.js";
import markdown from "../util/markdown.js";
import { db } from "../../db/db.js";
import axios from "axios";

const setRankScheduler = () => {
  cron.schedule("0 0,30  * * * *", async () => {
    try {
      const now = getTimeYYYYMMDDHHMMSS().split("-");
      const nowYYYYMMDD = getTimeYYYYMMDD();
      const result = await db.query(
        `select u.user_id, u.display_name, wakatime_api_key from api_sync api left join users u on api.user_id = u.user_id`
      );
      const data = result.rows;
      const filteredData = data.filter((row) => row.wakatime_api_key);

      const wakatimeData = await Promise.allSettled(
        filteredData.map((row) =>
          axios
            .get(
              `https://wakatime.com/api/v1/users/current/summaries?start=${nowYYYYMMDD}&end=${nowYYYYMMDD}&api_key=${row.wakatime_api_key}`
            )
            .then((response) => {
              return {
                ...row,
                study_time: response.data.cumulative_total.seconds,
                most_language: response.data.data[0]?.languages[0]?.name,
              };
            })
        )
      );

      const filteredWakatimeData = wakatimeData.map((e) => {
        if (e.status === "fulfilled") {
          return e.value;
        }
      });

      const sortedWakatimeData = filteredWakatimeData.sort((a, b) => {
        return b.study_time - a.study_time;
      });

      const embed = new EmbedBuilder()
        .setColor(0xe499fa)
        .setTitle(
          `🔥 ${now[0]}년${now[1]}월${now[2]}일 ${now[3]}시 ${now[4]}분 랭킹`
        )
        .setDescription(`📖 랭킹은 1~20위 까지 보여집니다.`)
        .addFields({
          name: `🕜 30분마다 갱신됩니다.`,
          value: markdown.blank(),
        });

      sortedWakatimeData.map((item, index) => {
        if (item.study_time <= 60) {
          embed.addFields({
            name: `${index + 1} 위 ${item.display_name}`,
            value: `😢 아직 학습 시간이 기록되지 않았어요.`,
          });
          return;
        }
        const hhmm = secondToHHMM(item.study_time).split("-");
        embed.addFields({
          name:
            index === 0
              ? `👑 ${item.display_name}`
              : `${index + 1} 위 ${item.display_name}`,
          value: `📖 ${item.most_language} 위주로 ${hhmm[0]}시간 ${hhmm[0]}분 학습하였습니다.\n`,
        });
      });

      const channel = client.channels.cache.get(ENV.DISCORD_CHANNEL_RANK);

      await channel.send({
        embeds: [embed],
      });
    } catch (error) {
      console.log(error);
      const channel = client.channels.cache.get(ENV.DISCORD_CHANNEL_RANK);
      await channel.send({
        content: "🚫 랭킹을 불러오는데 실패했습니다.",
      });
    }
  });
};

export { setRankScheduler };
