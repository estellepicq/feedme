const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const smtpConfig = require('../config/nodemailer.json')

router.post('/send', (req, res, next) => {
  const mailOptions = {
		from: req.body.name + ' <' + req.body.email + '>',
		to: 'estelle@estellepicq.com',
		subject: req.body.from + ' Nouveau message',
		text: req.body.message
	};

	const transporter = nodemailer.createTransport(smtpConfig);

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return res.json({success: false, msg: error});
		}
		return res.json({success: true, msg: info});
	});
});

module.exports = router;