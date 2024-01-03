const { selectGenre } = require("../models/app.models");

exports.getGenres = (req, res) => {
    selectGenre()
    .then((result) => {
        res.status(200).send(result);
    })
    .catch((err) => {
        next(err)
    })
}