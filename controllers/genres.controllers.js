const { selectGenres, addGenre } = require("../models/genres.models");

exports.getGenres = (req, res) => {
    selectGenres()
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            next(err)
        })
}

exports.postGenres = (req, res, next) => {
    const newGenre = req.body;
    const genreRegex = new RegExp(`^${newGenre.genre}$`, "i");
    selectGenres()
        .then((genres) => {
            const genresArray = genres.map((genre) => {
                return genre.genre;
            });
            const genreExists = genresArray.some((genre) =>
                genreRegex.test(genre)
            );
            if (genreExists) {
                return Promise.reject({ status: 400, msg: "genre already exists" });
            }
        })
        .then(() => {
            return addGenre(newGenre);
        })
        .then((genre) => {
            res.status(201).send({ genre });
        })
        .catch(next);

}