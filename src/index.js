const Discord = require("discord.js");
const { token, prefix } = require("./config/details");

const client = new Discord.Client();

client.once("ready", () => {
  console.log("Bot is online!");
});

client.login(token);
