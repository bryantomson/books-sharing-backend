const book = require("../db/schema/book-schema")
const mongoose = require('mongoose')

exports.selectSingleBook = (id) => {

    if (id.length !== 24) {
        return Promise.reject({ status: 400, msg: "bad request" });
    }

    return book.findById(id)
        .then((result) => {
            if (result) {
                return result
            } 
        })
        .catch((error) => {
            return Promise.reject({ status: 404, msg: 'book not found' })
        });
};
