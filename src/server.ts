import express from "express";
import {Server} from "http";
import {getDBConnection} from "./database";

const eventRouter = require("./events");

export const start = async (): Promise<Server> => new Promise(async (resolve, reject) => {
    try {
        const port = 4040;
        const app = express();

        getDBConnection();

        app.use('/events', eventRouter);

        app.get('/', (req, res) => {
            res.status(404).json({
                error:
                "Proceed to the /events endpoint in order to access data",
            });
        });

        
        const server = app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`);
            resolve(server);
        });
    } catch (err) {
        reject(err);
    }
})
