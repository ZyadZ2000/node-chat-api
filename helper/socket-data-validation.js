const JoiSchemas = require("../joi-schemas");

module.exports = (data) => {
  let result = null;
  Object.keys(data).forEach((key) => {
    result = null;
    switch (key) {
      case "userId":
      case "chatId":
      case "requestId":
        result = JoiSchemas.mongoIdSchema.validate(data[key]);
        break;
      case "chatName":
        result = JoiSchemas.chatNameSchema.validate(data[key]);
        break;
      case "messageContent":
        result = JoiSchemas.messageContentSchema.validate(data[key]);
        break;
      case "requestType":
        result = JoiSchemas.requestTypeSchema.validate(data[key]);
        break;
      default:
        throw new Error("Invalid data");
    }
    if (result.error)
      throw new Error(`Invalid data, error message: ${result.error.message} `);
  });
};
