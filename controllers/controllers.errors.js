const handle404Routes = (req, res, next) => {
    res.status(404).send({msg: "path not found"})
};

module.exports = {handle404Routes}