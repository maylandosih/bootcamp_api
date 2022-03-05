const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "lumbantoruan0705@gmail.com",
        pass: "hmvrwfgpqsrsqeqy"
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = { transporter }