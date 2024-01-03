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
    return users
  })

}

exports.addUser = (newUser) => {

  newUser.rating = 0
  newUser.number_borrowed = 0
  newUser.number_lent = 0
  if (!newUser.avatar_img) {
    newUser.avatar_img = 'https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-avatar-vector-isolated-on-white-background-png-image_1694546.jpg'
  }
  if (!newUser.bio) {
    newUser.bio = ''
  }
  const user = new User(newUser);
  return user.save().then(() => {
    return user
  })

}
