const {
    selectSingleBook,
} = require("../models/app.models");

exports.getBookById = (req, res,next) => {
    const paramId = req.params.id
 
    selectSingleBook(paramId).then((result) => {
        res.status(200).send({ book: result });
    })
    .catch((err) => {
        next(err)
     });
}

