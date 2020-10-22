const Discord = require("discord.js");
const { Request } = require("./classes/Request");
const { token, prefix, requestChannelId } = require("./config/details");

const client = new Discord.Client();

let activeRequests = [];
let cooldowns = [];
let pyes = "🔥";
let pno = "🔥";

// Function to cleanup the arrays every 30 minutes, keeping the memory less bloated.
setInterval(() => {
  console.log("Cleaning activeRequests and cooldowns...");
  const tempActiveRequests = [];
  const tempCooldowns = [];

  activeRequests.forEach(request => {
    if (!request.done) tempActiveRequests.push(request);
  });
  cooldowns.forEach(cooldown => {
    if (cooldown == null) tempCooldowns.push(cooldown);
  });

  activeRequests = tempActiveRequests;
  cooldowns = tempCooldowns;
}, 1800000); // 30 minutes = 1800000ms

client.once("ready", () => {
  console.log("Bot is online!");
});

client.on("messageReactionAdd", (r, u) => {
  activeRequests.forEach(async ({ user, requestMessage, embed, setDone }) => {
    if (requestMessage === r.message) {
      if (u === user && r.emoji.name === "pyes") {
        requestMessage.channel.send(
          "Alright, I'll be adding your request to the list of requests, then!"
        );
        client.channels
          .fetch(requestChannelId)
          .then(channel => {
            channel.send(embed).then(async msg => {
              await msg.react(pyes);
              await msg.react(pno);
              setDone();
            });
          })
          .catch(console.error);
      } else if (u === user && r.emoji.name === "pno") {
        requestMessage.channel.send(
          "The request has been cancelled by the user."
        );
        const index = cooldowns.findIndex(cooldown => cooldown === user);
        cooldowns[index] = null;

        requestMessage.delete();
        setDone();
      }
    }
  });
});

client.on("message", async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  switch (command) {
    case "request": {
      if (cooldowns.find(cooldown => cooldown === message.author)) {
        message.reply("try again in 15 seconds.");
        break;
      }

      if (!requestChannelId) {
        message.channel.send(
          "Unable to detect the request channel. Try again later"
        );
        break;
      }

      if (!args[0] || args[0] === "") {
        message.channel.send(
          "Invalid request. Format it as such:\nr!request MESSAGE"
        );
        break;
      }

      let content = "";
      args.forEach(arg => {
        content += `${arg} `;
      });

      if (content.length < 5) {
        message.channel.send(
          "Your request is too short, please enter at least 5 characters."
        );
        break;
      }

      const embed = new Discord.MessageEmbed()
        .setColor("#ff69bc")
        .setTitle(`Request by ${message.author.username}`)
        .setDescription(content);

      const requestMessage = await message.channel.send(
        "Does this look right?",
        embed
      );

      activeRequests.push(new Request(message.author, requestMessage, embed));
      cooldowns.push(message.author);

      console.log(`New request closes in 15 seconds.`);

      // Using emoji unicode here, this may break, could potentially replace by the emoji's name
      pyes = await client.emojis.cache.find(emoji => emoji.name === "pyes");
      pno = await client.emojis.cache.find(emoji => emoji.name === "pno");

      await requestMessage.react(pyes);
      await requestMessage.react(pno);

      setTimeout(() => {
        try {
          const request = activeRequests.find(
            r => r.requestMessage === requestMessage
          );
          if (request && !request.done) {
            requestMessage.delete();
            message.reply("Your request timed out.");
            request.setDone();
          }
        } catch (err) {
          console.log(err);
        }
      }, 15000);

      setTimeout(() => {
        try {
          const index = cooldowns.findIndex(c => c === message.author);
          if (index !== -1) cooldowns[index] = null;
        } catch (err) {
          console.log(err);
        }
      }, 15000);

      break;
    }
    default: {
      break;
    }
  }
});

client.login(token);
