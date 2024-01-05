const jwt = require('jsonwebtoken');
const { selectUserById,
    selectUsers,
    addUser,
    updateUser,
    deleteUserById,
    authenticateLogin,
    checkValidToken
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
}

exports.deleteUser = (req, res, next) => {
  const { user_id } = req.params;
  deleteUserById(user_id)
    .then((deletedUser) => {
      res.status(204).send(deletedUser);
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  const newUser = req.body;
  const newUsername = new RegExp(`^${newUser.username}$`, "i");
  selectUsers()
    .then((users) => {
      const usernames = users.map((user) => {
        return user.username;
      });
      const usernameExists = usernames.some((username) =>
        newUsername.test(username)
      );
      if (usernameExists) {
        return Promise.reject({ status: 400, msg: "username already in use" });
      }
    })
    .then(() => {
      return addUser(newUser);
    })
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch(next)
}

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

exports.postLogin = (req, res, next) => {
  const { username, password } = req.body;
  authenticateLogin(username,password)
    .then((user) => {
      const token = jwt.sign({ username: user.username }, 'secret-key');
      res.status(200).json({ token });
    })
    .catch(next);
};

exports.getToken = (req, res, next) => {
  const token = req.headers.authorization;
  checkValidToken(token)
    .then((decoded) => {
      res.status(200).send('Protected route accessed');
    })
    .catch(next);
};