const fs = require("fs/promises");


exports.getEndpoints = (req, res, next) => {
    res.setHeader("Content-Type", "application/json")
    res.statusCode = 200
    fs.readFile(`${__dirname}/endpoints.json`, "utf-8")
    .then((endpoints) => {
        res.send({endpoints: {endpoints}});
    })
}