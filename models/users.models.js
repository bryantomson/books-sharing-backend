const User = require("../db/schema/user-schema");

exports.selectUserById = async (id) => {
  if (id.length !== 24) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  const user = await User.findById(id);
  if (user) {
    return user;
  } else {
    return Promise.reject({ status: 404, msg: "user not found" });
  }
};
