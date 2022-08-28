import 'module-alias/register';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from '@/config/config';
import Log from '@/library/Logging';
import doctorRoutes from '@/routes/Doctor';

const router = express();

// Connect to Mongo
mongoose
	.connect(config.mongo.url, { retryWrites: true, w: 'majority' })
	.then(() => {
		Log.info('Connected to MongoDB.');
		StartServer();
	})
	.catch((error) => {
		Log.error('Unable to connect:');
		Log.error(error);
	});

// Start server only if connected to Mongo
const StartServer = () => {
	router.use((req, res, next) => {
		// Log the request
		Log.info(`Incoming -> Method: [${req.method}], URL: [${req.url}], IP: [${req.socket.remoteAddress}]`);

		res.on('finish', () => {
			//Log response
			Log.info(`Outgoing -> Method: [${req.method}], URL: [${req.url}], IP: [${req.socket.remoteAddress}], Status: [${res.statusCode} ${res.statusMessage}]`);
		});
		next();
	});
	router.use(express.urlencoded({ extended: true }));
	router.use(express.json());

	// Rules of API
	router.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

		if (req.method == 'OPTIONS') {
			res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
			return res.status(200).json({});
		}

		next();
	});
	// Routes
	router.use('/doctors', doctorRoutes);

	// Healthcheck
	router.get('/healthcheck', (req, res, next) => res.status(200).json({ message: 'All good.' }));

	// Error Handling
	router.use((req, res, next) => {
		const error = new Error('Not found');
		Log.error(error);

		return res.status(404).json({ message: error.message });
	});

	http.createServer(router).listen(config.server.port, () => Log.info(`Server running on port ${config.server.port}.`));
};
