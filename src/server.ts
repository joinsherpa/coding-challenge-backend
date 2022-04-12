import express from "express"
import {Server} from "http";
import {initializeDB} from "./database";

const sleep = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms))

export const start = async (): Promise<Server> => new Promise(async (resolve, reject) => {
    try {
        const port = 4040
        const app = express()
        const db = await initializeDB()
        if( !db) {
            reject("Database not connected")
        }
        app.get('/', (req, res) => {
            res.send('Hello World!')
        })

        const server = app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`)
            resolve(server)
        })
    } catch (err) {
        reject(err)
    }
})
