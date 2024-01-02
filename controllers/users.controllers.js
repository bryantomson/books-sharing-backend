const { selectUserById } = require("../models/users.models");

exports.getUserById = (req, res, next) => {
  const { id } = req.params;
  selectUserById(id)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
