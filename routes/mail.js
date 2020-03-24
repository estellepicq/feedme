const express = require('express');
const router = express.Router();
require('dotenv').config();
const nodemailer = require('nodemailer');

router.post('/send', (req, res, next) => {
  const mailOptions = {
		from: req.body.name + ' <' + req.body.email + '>',
		to: 'estelle@estellepicq.com',
		subject: req.body.from + ' Nouveau message',
		text: req.body.message
	};

	const transporter = nodemailer.createTransport({
		host: "ssl0.ovh.net",
		port: 465,
		secure: true,
		auth: {
			user: process.env.NODEMAILER_USER,
			pass: process.env.NODEMAILER_PASS
		}
	});

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return res.json({success: false, msg: error});
		}
		return res.json({success: true, msg: info});
	});
});

module.exports = router;