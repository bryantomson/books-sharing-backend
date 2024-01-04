const Message = require("../db/schema/message-schema");

exports.selectMessages = (usersArray) => {
  usersArray.sort();
  return Message.find({ between: usersArray }).then((data) => {
    return data;
  });
};
