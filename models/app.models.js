const book = require("../db/schema/book-schema")

exports.selectSingleBook = (id) => {

    return book.findById(id)
        .then((result) => {
            return result
        })
        .catch((error) => {
            return Promise.reject({ status: 404, msg: 'does not exist' })
        });
};
