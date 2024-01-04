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
    if (newGenre.genre && typeof newGenre.genre !== 'string') {
        return Promise.reject({ status: 400, msg: 'bad request' })
    }
    const genre = new genreSchema(newGenre);
    return genre.save().then((data) => {
        return data
    });
}