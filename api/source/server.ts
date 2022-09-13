import 'module-alias/register';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import {config} from '@/config/config';
import {updateDayArrays} from '@/library/CronJobs'
import Log from '@/library/Logging';
import {logTraffic} from '@/middleware/LogTraffic';
import {rules} from '@/middleware/Rules'
import doctorRoutes from '@/routes/Doctor';
import reservationRoutes from '@/routes/Reservation';
import userRoutes from "@/routes/User";

const router = express();

// Connect to Mongo
mongoose
    .connect(config.mongo.url, {retryWrites: true, w: 'majority'})
    .then(() => {
        Log.info('Connected to MongoDB.');
        startServer();
        updateDayArrays();
    })
    .catch((error) => {
        Log.error('Unable to connect:');
        Log.error(error);
    });

// Start server only if connected to Mongo
const startServer = () => {
    // Middleware
    router.use(express.urlencoded({extended: true}));
    router.use(express.json());

    //Custom Middleware
    router.use(logTraffic);
    router.use(rules);

    // Routes
    router.use('/doctor', doctorRoutes);
    router.use('/reservation', reservationRoutes);
    router.use('/user', userRoutes)

    // Healthcheck Route
    router.get('/healthcheck', (req, res, next) => res.status(200).json({message: 'All good.'}));

    // Error Handling
    router.use((req, res, next) => {
        const error = new Error('Not found');
        Log.error(error);

        return res.status(404).json({message: error.message});
    });

    http.createServer(router).listen(config.server.port, () => Log.info(`Server running on port ${config.server.port}.`));
};
