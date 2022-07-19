import express from "express"
import {Server} from "http";
import { initializeDB } from "./services/database";
import { EventRouter } from './routes/events';


export const start = async (): Promise<Server> => new Promise(async (resolve, reject) => {
    try {
        const port = 4040
        const app = express()

        await initializeDB();
        console.log('DB initialized...')

        app.use('/events', EventRouter);

        const server = app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`)
            resolve(server)
        })
    } catch (err) {
        console.log('Server error: ', err)
        reject(err)
    }
})
