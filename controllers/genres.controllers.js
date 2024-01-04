const { selectGenre } = require("../models/genres.models");

exports.getGenres = (req, res) => {
    selectGenre()
    .then((result) => {
        res.status(200).send(result);
    })
    .catch((err) => {
        next(err)
    })
}