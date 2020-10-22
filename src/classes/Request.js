class Request {
  constructor(user, requestMessage, embed) {
    this.user = user;
    this.requestMessage = requestMessage;
    this.embed = embed;
    this.done = false;
    this.setDone = () => {
      this.user = null;
      this.requestMessage = null;
      this.embed = null;
      this.done = true;
    };
  }
}

module.exports = {
  Request,
};
