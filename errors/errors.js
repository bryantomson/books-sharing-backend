exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleMongoErrors = (err, req, res, next) => {
  if (err.errors) {
    const reason = Object.keys(err.errors)[0]
    res.status(400).send({msg: err.errors[reason].properties.message})
  }
}
