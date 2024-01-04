const { selectMessages } = require("../models/messages.models");

exports.getMessages = (req, res, next) => {
  const { users } = req.query;
  const usersArray = users.split("-");
  selectMessages(usersArray).then((messages) => {
    res.status(200).send({ messages });
  });
};
