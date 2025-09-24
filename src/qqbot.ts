import { Bot } from "el-bot";

const bot = new Bot({
  napcat: {
    protocol: "wss",
    host: "codenebula.top",
    port: 8080,
    accessToken: "nebulagjr0303"
  }
})

bot.start();


