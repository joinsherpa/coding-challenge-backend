import express, { Response, Request } from "express"
import {Server} from "http";
import {connection, getAllEvents, addEvent, addAttendee} from "./mongo";


export const start = async (): Promise<Server> => new Promise(async (resolve, reject) => {
    try {
        const port = 4040
        const app = express()
        connection();

        app.get('/events', (req: Request, res: Response) => {
            getAllEvents()
                .then((results) => {
                    console.log(results);
                    res.status(200).send(results)
                })
                .catch((err) => {
                    console.log(err)
                    res.status(404).send(`Err: ${err}`)
                })
        })

        app.get('/events/:eventId', (req, res) => {
            res.send('Hello World!')
        })

        app.post('/events/addEvent', (req: Request, res: Response) => {
            addEvent(req.body)
                .then((data) => {
                    res.status(201).send(data)
                })
                .catch((err) => {
                    console.log(err)
                })
        })

        app.post('/events/addAttendee', (req: Request, res: Response) => {
            const targetId = req.body.id;
            const newUser = {
                status: req.body.status,
                email: req.body.email,
                attName: req.body.attName
            }
            addAttendee(targetId, newUser)
                .then((data) => {
                    res.status(201).send(data)
                })
                .catch((err) => {
                    console.log(err)
                })
        })

        const server = app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`)
            resolve(server)
        })
    } catch (err) {
        reject(err)
    }
})
