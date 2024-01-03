const User = require("../db/schema/user-schema");

exports.selectUserById = (id) => {
  if (id.length !== 24) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  return User.findById(id).then((user) => {
    if (user) {
      return user;
    } else {
      return Promise.reject({ status: 404, msg: "user not found" });
    }
  });
};

exports.selectUsers = () => {
  return User.find({}).then((users) => {
    return users;
  });
};
