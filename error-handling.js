const handle404Routes = (req, res, next) => {
    res.status(404).send({msg: "path not found"})
};

//handles sql query error
const handle400Error = (err, req, res, next) => {
    if (err.code === '22P02'){
        res.status(400).send({msg: 'bad request'});
    }
    else{
        next(err);
    }
};

//handles promise reject to send back status and message
const handle500Error = (err, req, res, next) => {
    if(err.msg !== undefined){
        res.status(err.status).send({msg: err.msg});
    }
    else{
        next(err);
    }
};

module.exports = {handle404Routes, handle400Error, handle500Error}