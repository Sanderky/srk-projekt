if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
import express from 'express';
import log from "./logger";
import connect from "./db/connect";
import router from "./routes/index"

const port = parseInt(process.env.PORT!) as number;
const host = process.env.HOST as string;

const server = express();

server.use(express.json());
server.use(express.urlencoded({extended: false}));

server.listen((process.env.PORT || 3000), () => {
    log.info(`Server listening at http://${host}:${port}`);
    connect();
    router(server);
});