const { selectEndpoints } = require("../models/app.models")


exports.getEndpoints = (req,res,next)=>{
    selectEndpoints()
        .then((endpoints)=>{
            res.status(200).send({endpoints})
    })
    .catch(next)
}