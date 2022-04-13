import express from "express"
import { Request, Response } from "express"
import {Server} from "http";
import { Between, LessThan, MoreThan } from "typeorm";
import {initializeDB} from "./database";
import { Event } from "./entity/Event";

const sleep = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms))

interface EventsListingQuery {
    page:number
    pageSize: number
    from: number
    until: number
}
export const start = async (): Promise<Server> => new Promise(async (resolve, reject) => {
    try {
        const port = 4040
        const app = express()
        const db = await initializeDB()
        if( !db) {
            reject("Database not connected")
        }
        app.get('/events', async (req:Request<any, any, any, EventsListingQuery>, res:Response) => {
            const pageSize = req.query.pageSize || 10
            const page = req.query.page || 1
            const from = req.query.from || +new Date()
            const until = req.query.until
            let where = { date: MoreThan(from) }
            if(until){
                where.date = Between(from, until)
            }
            const events = await db?.getRepository(Event).find({
                where,
                relations: {
                    location: true,
                    organizer: true,
                    invitations: true
                },
                take: pageSize,
                skip: (page - 1 ) * pageSize
            })
            res.json({ results: events })
        })
        app.get('/events/:eventId', async (req:Request, res:Response) => {
            const event = await db?.getRepository(Event).findOne({
                where : {
                    id: parseInt(req.params.eventId),
                },
                relations: {
                    location: true,
                    organizer: true
                }
            })

            res.json(event)
        })

        const server = app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`)
            resolve(server)
        })
    } catch (err) {
        reject(err)
    }
})
