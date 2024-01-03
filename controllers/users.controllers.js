const { selectUserById } = require("../models/users.models");

exports.getUserById = (req, res, next) => {
  const { user_id } = req.params;
  selectUserById(user_id)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
