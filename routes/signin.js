const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

router.post('/', (req, res, next) => {
	// Check if email exists in DB
	// Create
	// Update
	// Send mail with required document

	// const transporter = nodemailer.createTransport({
	// 	host: "ssl0.ovh.net",
	// 	port: 465,
	// 	secure: true,
	// 	auth: {
	// 		user: process.env.NODEMAILER_USER,
  //   		pass: process.env.NODEMAILER_PASS
	// 	}
	// });

  // const mailOptions = {
	// 	from: req.body.name + ' <' + req.body.email + '>',
	// 	to: 'estelle@estellepicq.com',
	// 	subject: req.body.from + ' Nouveau message',
	// 	text: req.body.message
	// };

	// transporter.sendMail(mailOptions, (error, info) => {
	// 	if (error) {
	// 		return res.json({success: false, msg: error});
	// 	}
	// 	return res.json({success: true, msg: info});
	// });

});

module.exports = router;