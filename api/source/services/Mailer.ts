import { NextFunction, Request, Response } from 'express';
import hbs from 'nodemailer-express-handlebars';
import nodemailer from 'nodemailer';
import path from 'path';
import Log from '@/library/Logging';

const GMAIL_USERNAME = process.env.GMAIL_USERNAME || '';
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD || '';

interface Email {
	email: String;
	date: String;
	code: String;
	doctor: String;
	time: String;
}

const sendConfirmationEmail = (mailParameters: Email) => {
	const { email, date, code, doctor, time } = mailParameters;
	try {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: GMAIL_USERNAME,
				pass: GMAIL_PASSWORD
			}
		});

		const handlebarOptions = {
			viewEngine: {
				extname: '.handlebars',
				partialsDir: path.resolve('../api/public/views/email/'),
				layoutsDir: path.resolve('../api/public/views/email/'),
				defaultLayout: 'email'
			},
			viewPath: path.resolve('../api/public/views/email/')
		};

		transporter.use('compile', hbs(handlebarOptions));

		const mailOptions = {
			from: `"SRK" <${GMAIL_USERNAME}>`,
			to: `${email}`,
			subject: 'Potwierdzenie rezerwacji SRK',
			template: 'email',
			context: {
				code: `${code}`, //replace {{code}} with reservation code
				date: `${date}`, //replace {{date}} with reservation date
				doctor: `${doctor}`,
				time: `${time}`
			}
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				Log.error(error);
				return;
			}
			Log.info('Confirmation email sent to: ' + email);
			return;
		});
	} catch (error) {
		Log.error(error);
		return;
	}
};

export default { sendConfirmationEmail };
