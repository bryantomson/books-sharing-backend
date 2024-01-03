const genreSchema = require("../db/schema/genre-schema");

exports.selectGenre = () => {
    return genreSchema.find()
    .then((result) => {
        return result
    })
    .catch((error) => {
        return Promise.reject({ status: 400, msg: 'does not exist' })
    });
};