
exports.handle400 = (err,req,res,next)=>{
  if(err.status === 400){
    res.status(400).send({msg:'bad request'})
}
else{
    next(err)
}
}

exports.handle404 = (err, req, res, next) => {
  if(err.status === 404){
    (res.status(404).send({ msg: "not found" }))
  } else{
    next(err)
  }
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
};
