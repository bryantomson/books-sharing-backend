const Message = require("../db/schema/message-schema");

exports.selectMessages = (users) => {
  if (!users) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  const usersArray = users.split("-");
  if (usersArray.length !== 2) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  usersArray.sort();
  return Message.find({ between: usersArray })
    .sort({ timestamp: "asc" })
    .then((data) => {
      if (!data.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        return data;
      }
    });
};
