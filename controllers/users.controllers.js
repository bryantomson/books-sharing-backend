const {
  selectUserById,
  selectUsers,
  updateUser,
} = require("../models/users.models");

exports.getUserById = (req, res, next) => {
  const { user_id } = req.params;
  selectUserById(user_id)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.patchUser = (req, res, next) => {
  const { user_id } = req.params;
  selectUserById(user_id)
    .then((user) => {
      return updateUser(user, req.body);
    })
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};