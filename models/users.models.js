const User = require("../db/schema/user-schema");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

  const hashedPassword = bcrypt.hashSync(newUser.password, 10);

  newUser.rating = 0
  newUser.number_borrowed = 0
  newUser.number_lent = 0
  newUser.password = hashedPassword
  
  if (!newUser.avatar_img) {
    newUser.avatar_img = 'https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-avatar-vector-isolated-on-white-background-png-image_1694546.jpg'
  }
  if (!newUser.bio) {
    newUser.bio = ''
  }
}


exports.deleteUserById = (id) => {
  
  if (id.length !== 24) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  return User.findByIdAndDelete(id).then((user) => {
    if (user) {
      return user;
    } else {
      return Promise.reject({ status: 404, msg: "user not found" });
    }
  });
};


exports.updateUser = (user, request) => {
  const validUpdates = [
    "newLocation",
    "newPassword",
    "newAvatar",
    "newBio",
    "incrementRating",
    "incrementBorrowed",
    "incrementLent",
  ];

  for (const key in request) {
    if (!validUpdates.includes(key)) {
      return Promise.reject({ status: 400, msg: "bad request" });
    }
  }

  if (
    !Object.keys(request).length ||
    (request.newLocation && typeof request.newLocation !== "string") ||
    (request.newPassword && typeof request.newPassword !== "string") ||
    (request.newAvatar && typeof request.newAvatar !== "string") ||
    (request.newBio && typeof request.newBio !== "string") ||
    (request.incrementRating && typeof request.incrementRating !== "number") ||
    (request.incrementBorrowed && request.incrementBorrowed !== 1) ||
    (request.incrementLent && request.incrementLent !== 1)
  ) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  if (request.newLocation) user.location = request.newLocation;
  if (request.newPassword) user.password = request.newPassword;
  if (request.newAvatar) user.avatar_img = request.newAvatar;
  if (request.newBio) user.bio = request.newBio;
  if (request.incrementRating) user.rating += request.incrementRating;
  if (request.incrementBorrowed) user.number_borrowed++;
  if (request.incrementLent) user.number_lent++;

  return user.save().then((patchedUser) => {
    return patchedUser;
  });
};

exports.authenticateLogin = (username,password) => {
  return User.findOne({ username })
    .then((user) => {
      if (user) {
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (isPasswordValid) {
          return user;
        } else {
          return Promise.reject({ status: 401, msg: "incorrect password" });
        }
      } else {
        return Promise.reject({ status: 404, msg: "user not found" });
      }
    })
};

exports.checkValidToken = (token) => {
  return new Promise((resolve, reject) => {
    if (token) {
      jwt.verify(token, 'secret-key', (err, decoded) => {
        if (err) {
          reject({ status: 401, msg: "Invalid token" });
        } else {
          resolve(decoded)
        }
      });
    } else {
      console.log('got here')
      reject({ status: 401, msg: "Token not provided" });
    }
  });
};
