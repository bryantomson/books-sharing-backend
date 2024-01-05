const { selectMessages } = require("../models/messages.models");

exports.getMessages = (req, res, next) => {
  const { users } = req.query;
  selectMessages(users)
    .then((messages) => {
      res.status(200).send({ messages });
    })
    .catch(next);
};
