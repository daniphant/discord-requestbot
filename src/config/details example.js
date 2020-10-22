// Add your information and rename the file to "details.js" in order for the bot to work

module.exports = {
  name: "NAME OF YOUR BOT HERE",
  prefix: "PREFIX FOR YOUR MESSAGES SUCH AS ! OR r!",
  token: "TOKEN OF YOUR BOT HERE",
  /* By having this id be declared here, it limits the bot to being able to send the requests to only one channel.
   If you wish to make this functional for multiple servers, you can store the requestChannelId's along with their Guild's in a separate json
   Or a database such as firebase. */
  requestChannelId: "THE REQUEST CHANNEL'S ID",
};
