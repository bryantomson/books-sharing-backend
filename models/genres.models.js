const genreSchema = require("../db/schema/genre-schema");

exports.selectGenres = () => {
    return genreSchema.find()
        .then((result) => {
            return result
        })
        .catch((error) => {
            return Promise.reject({ status: 404, msg: 'Not Found' })
        });
};

exports.addGenre = (newGenre) => {
    const genre = new genreSchema(newGenre);
    return genre.save().then((data) => {
        return data
    });
}