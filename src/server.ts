import express, { Response, Request } from "express";
import cors from "cors";
import { Server } from "http";
import { Event, Organizer, Attendee, connection, getAllEvents, getAllAttendees, addEvent, addAttendee, getEventDetails } from "./mongo";
import { searchAddressHandler, GoogleGeocodingResponse } from "./geocoding";
import { getWeather } from "./weather";

export const start = async (): Promise<Server> => new Promise(async (resolve, reject) => {

    try {
        const port = 4040;
        const app = express();
        app.use(cors());
        app.use(express.json());

        app.get('/events', (req: Request, res: Response) => {
            let from = req.query.from !== '' ? +req.query.from! : 0;
            let to = req.query.to  !== '' ? +req.query.to! : 0;

            getAllEvents(from, to)
                .then((results) => {
                    res.status(200).send(results)
                })
                .catch((err) => {
                    res.status(404).send(`Err: ${err}`)
                })
        })

        app.get('/weather', (req: Request, res: Response) => {
        if (req?.query?.weatherLoc) {
            const weatherLoc = req.query.weatherLoc as string;
            searchAddressHandler(weatherLoc)
              .then(response=>{
                if (response.data.status !== 'OK') {
                  res.status(400).send('could not find location')
                }
                const coordinates = response.data.results[0].geometry.location;
                getWeather(coordinates.lat, coordinates.lng)
                  .then((response) => {res.status(200).send(response.data.daily)})
                  .catch((err) => {
                      res.status(404).send('unable to retrieve weather')
                  })
              })
              .catch(err=>{
                res.status(404).send('could not find location')
              })
            }
        })

        app.get('/events/:eventId', (req: Request, res: Response) => {
            const eventId = req.params.eventId;
            let attendeeList: Attendee[] = [];
            getAllAttendees(eventId)
                .then((results) => {
                    attendeeList = results
                })
                .catch((err)=> {
                    console.log(err)
                })
            getEventDetails(eventId)
                .then((results: Event[]) => {
                    if (results[0].attendees) {
                        // results[0].attendees = attendeeList;
                        console.log(results[0].attendees)
                    }
                    res.status(200).send(results)
                })
                .catch((err)=> {
                    console.log(err)
                })
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
            const { id, status, email, attName } = req.body;
            const newUser = {
                status: status,
                email: email,
                attName: attName,
                eventId: id
            }
            addAttendee(newUser)
                .then((data) => {
                    res.status(201).send(data)
                })
                .catch((err) => {
                    console.log(err)
                })
        })

        connection();

        const server = app.listen(port, () => {
            console.log(`Listening at http://localhost:${port}`)
            resolve(server)
        })
    } catch (err) {
        reject(err)
    }
})
