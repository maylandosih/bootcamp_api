const jwt = require("jsonwebtoken");// untuk membuat dan menerjemahkan token encryption

module.exports = {
    createToken: (payload) => {
        // fungsi untuk membuat token dengan masa berlaku token adalah 12 jam
        return jwt.sign(payload, "tokenKu", {
            expiresIn: "12h"
        })
    },
    readToken: (req, res, next) => {
        jwt.verify(req.token, "tokenKu", (err, decoded) => {
            if (err) {
                res.status(401).send({
                    messages: "User not authorization",
                    success: false,
                    error: err
                })
            }

            // data hasil terjemahan token
            req.dataUser = decoded

            next()
        })
    }
}