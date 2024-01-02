const { selectUserById, selectUsers, addUser } = require("../models/users.models");

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
}

exports.postUser = (req, res, next) =>{
  const newUser = req.body
  addUser(newUser)
  .then((user)=> {
    res.status(201).send({user})
  })
  .catch(next)
}
