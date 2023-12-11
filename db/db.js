import pkg from "pg";
import { clog } from "../util/log.js";

const Client = pkg.Client; // ES6 모듈로 작성되어있지 않아서 이렇게 import

const ENV = process.env;

const db = new Client({
  user: ENV.DB_USER,
  host: ENV.DB_HOST,
  database: ENV.DB_SCHEME,
  password: ENV.DB_PASSWORD,
  port: ENV.DB_PORT,
  ssl: { rejectUnauthorized: false },
});

const makeDBConnection = async () => {
  return db.connect().then(() => {
    clog("✅ DB 연결 완료");
    return true;
  });
};

process.on("SIGINT", () => {
  db.end()
    .then(() => {
      clog("🚫 DB 연결 종료\n");
      process.exit(0);
    })
    .catch((err) => {
      process.exit(1);
    });
});

export { db, makeDBConnection };
