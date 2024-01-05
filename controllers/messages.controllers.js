const {
  selectMessages,
  selectConversations,
} = require("../models/messages.models");
const { selectUsers } = require("../models/users.models");

exports.getMessages = (req, res, next) => {
  const { users } = req.query;
  selectMessages(users)
    .then((messages) => {
      res.status(200).send({ messages });
    })
    .catch(next);
};

exports.getConversations = (req, res, next) => {
  const { username } = req.params;
  selectUsers(username)
    .then((users) => {
      if (!users.length) {
        return Promise.reject({ status: 404, msg: "user not found" });
      } else {
        return selectConversations(username);
      }
    })
    .then((conversations) => {
      res.status(200).send({ conversations });
    })
    .catch(next);
};
