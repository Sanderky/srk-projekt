if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
import mongoose from "mongoose";
import log from "../logger";

function connect() {
    const dbUri = process.env.DATABASE_URL as string;

    return mongoose
        .connect(dbUri)
        .then(() => {
            log.info("Database connected.");
        })
        .catch((error) => {
            log.error("Database error.", error);
            process.exit(1);
        });
}

export default connect;