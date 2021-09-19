const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const smtpConfig = require('../config/nodemailer.json')

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
							console.log('subscriber updated');
						})
						.catch(error => {
							console.log(error);
						});
					} else {
						console.log('subscriber already has requiredDoc');
					}
			} else {
				// Create
				global.db
					.collection('subscribers')
					.add({ email: email, documents: [requiredDoc] })
					.then(() => {
						console.log('subscriber created');
					})
					.catch(error => {
						console.log(error);
					});
			}
    })
		.catch(error => console.log(error))
		.finally(() => {
			const possibleDocs = [
				{ id: 'foodList', name: 'aliments riches et pauvres en FODMAPs' },
				{ id: 'fodmapsRecipes', name: 'recettes pauvres en FODMAPs' },
			];
			const requiredDocName = possibleDocs.find(d => d.id === requiredDoc).name;
			// Send mail with required document
			const mailOptions = {
				from: 'Estelle <estelle@estellepicq.com>',
				to: email,
				subject: '[Feed Me] Bonjour !',
				text: 'Voici la liste des ' + requiredDocName + ', j\'espère que cela pourra vous aider. Soignez-vous bien !',
				attachments: [{ filename: requiredDoc + '.pdf', path: './assets/' + requiredDoc + '.pdf', contentType: 'application/pdf' }]
			};
		
			const transporter = nodemailer.createTransport(smtpConfig);

			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					return res.json({success: false, msg: error});
				}
				return res.json({success: true, msg: info});
			});
		});

});

module.exports = router;