const express = require('express');
const router = express.Router();
require('dotenv').config();
const nodemailer = require('nodemailer');

router.post('/', (req, res, next) => {
	const { email, requiredDoc } = req.body;
	global.db
    .collection('subscribers')
    .get()
    .then(function(documents) {
			const subscribers = [];
			documents.forEach((doc) => subscribers.push({ ...doc.data(), id: doc.id }));
			const subscriber = subscribers.find(sub => sub.email === email);
			// Check if email exists in DB
			if (subscriber) {
				// Update only if requiredDoc isnt already in the list
				if (!subscriber.documents.find(d => d === requiredDoc)) {
					global.db
						.collection('subscribers')
						.doc(subscriber.id)
						.set({ documents: [...subscriber.documents, requiredDoc] }, { merge: true })
						.then(() => {
							// res.send({ success: true, msg: 'subscriber updated' });
						})
						.catch(error => {
							// res.send({ success: false, msg: error });
						});
					} else {
						// res.send({ success: true, msg: 'subscriber already has requiredDoc' });
					}
			} else {
				// Create
				global.db
					.collection('subscribers')
					.add({ email: email, documents: [requiredDoc] })
					.then(() => {
						// res.send({ success: true, msg: 'subscriber created' });
					})
					.catch(error => {
						// res.send({ success: false, msg: error });
					});
			}
    })
		.catch(error => console.log(error))
		.finally(() => {
			// Send mail with required document
			console.log('send ' + requiredDoc + ' to ' + email);
			const mailOptions = {
				from: 'Estelle <no-reply@feedinggood.com>',
				to: email,
				subject: 'Salut !',
				text: 'voici ton document'
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

});

module.exports = router;