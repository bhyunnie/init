import dotenv from "dotenv";
import banner from "./util/banner.js";
import {
  Client,
  Events,
  GatewayIntentBits,
  Routes,
  REST,
  Collection,
} from "discord.js";
import fs from "fs";
import path from "path";

const __dirname = path.resolve();

dotenv.config();
const ENV = process.env;

// TODO
// cron , pm2 달아야할듯
// aws 로 옮기자
// 등록할 커맨드 정리 필요
// 연동할 것들 정리 github, wakatime 등등
// 모듈 분리 필요

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`🤖 봇 계정 ${readyClient.user.tag} 활성화 완료`);
  console.log(banner);
});

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

client.commands = new Collection();
const commands = [];

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  console.log(`📜 명령어 파일 로딩 중...`);
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const fileURL = new URL(`file://${filePath}`);
    const command = await import(fileURL);

    // 콜렉션으로 set 해서 추가해야됨
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
      commands.push(command.data.toJSON());
    } else {
      console.log(`🚫 ${fileURL} 파일에 data || execute 가 정의 되어있지 않음`);
    }
  }
}

const rest = new REST().setToken(ENV.DISCORD_BOT_TOKEN);

(async () => {
  try {
    console.log(`🚀 ${commands.length} 개의 (/) 명령어 배포 시작`);

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
    console.log(`✅ ${data.length} 개의 (/) 명령어 배포 완료`);
  } catch (error) {
    console.error(error);
  }
})();

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.login(ENV.DISCORD_BOT_TOKEN);
