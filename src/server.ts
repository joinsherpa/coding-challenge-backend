import express, { Response, Request } from "express";
import cors from "cors";
import { Server } from "http";
import {
  Event,
  DetailedEvent,
  Weather,
  Organizer,
  Attendee,
  connection,
  getAllEvents,
  getAllAttendees,
  addEvent,
  addAttendee,
  getEventDetails,
} from "./mongo";
import { searchAddressHandler, GoogleGeocodingResponse } from "./geocoding";
import { getWeather } from "./weather";

export const start = async (): Promise<Server> =>
  new Promise(async (resolve, reject) => {
    try {
      const port = 4040;
      const app = express();
      app.use(cors());
      app.use(express.json());

      app.get("/events", (req: Request, res: Response) => {
        let from = req.query.from !== "" ? +req.query.from! : 0;
        let to = req.query.to !== "" ? +req.query.to! : 0;
        let lastId = req.query.lastId !== '' ? req.query.lastId : '';

        getAllEvents(from, to, lastId)
          .then((results) => {
            res.status(200).send(results);
          })
          .catch((err) => {
            res.status(404).send(`Err: ${err}`);
          });
      });

      app.get("/events/:eventId", async (req: Request, res: Response) => {
        const eventId = req.params.eventId;
        let attendeeList: Attendee[] = [];
        let targetEvent: Event;
        let updatedTarget: DetailedEvent;

        //Step1: get event specific attendees from attendees collection
        await getAllAttendees(eventId)
          .then((results) => {
            attendeeList = results;
          })
          .catch(() => {
            //don't need to do anything, just leave attendee list as empty array
          });

        //Step 2: get specific event from allevents collection
        await getEventDetails(eventId, lastId)
          .then(async (results: Event[]) => {
            results[0].attendees = attendeeList;
            targetEvent = results[0];
            //use location from returned event to get latitude and longitude from google geocode api if within window
            const currTime = new Date().getTime();
            const withinWindow =
              +targetEvent.date - +currTime < 604800000 &&
              +targetEvent.date - +currTime >= 0
                ? true
                : false;
            if (withinWindow && targetEvent.isOutside) {
              await searchAddressHandler(targetEvent.location)
                .then((response) => {
                  if (response.data.status !== "OK") {
                    res.status(400).send("could not find location");
                  } else {
                    //upon successful retrieval of latitude and longitude
                    const coordinates =
                      response.data.results[0].geometry.location;
                      console.log(targetEvent.location, coordinates)
                    //use latitude and longititude to get weather data from openweather api
                    getWeather(coordinates.lat, coordinates.lng)
                      .then((response) => {
                        //get specific days weather
                        let targetWeather = response.data.daily.forEach
                        ((oneDay: any) => {
                            let oneDayTime = new Date(oneDay.dt * 1000).toDateString();
                            let eventTime = new Date(targetEvent.date).toDateString();
                            if (oneDayTime === eventTime) {
                                updatedTarget =  {
                                    _id : targetEvent._id,
                                    name: targetEvent.name,
                                    isOutside: targetEvent.isOutside,
                                    location: targetEvent.location,
                                    date: targetEvent.date,
                                    organizer: targetEvent.organizer,
                                    attendees: attendeeList,
                                    weather: {
                                        temperatureInDegreesCelcius: Math.round(oneDay.temp.max - 273.15),
                                        chanceOfRain: oneDay.pop * 100 || 'Unknown Chance of Rain'
                                    }
                                  }
                                  res.status(200).send(updatedTarget)
                            }
                        })
                    })
                      .catch((err) => {
                        console.log('failed')
                      });
                  }
                })
                .catch((err) => {
                  console.log('failed')
                });
            } else {
                updatedTarget =  {
                    _id : targetEvent._id,
                    name: targetEvent.name,
                    isOutside: targetEvent.isOutside,
                    location: targetEvent.location,
                    date: targetEvent.date,
                    organizer: targetEvent.organizer,
                    attendees: attendeeList,
                    weather: null
                  }
                  res.status(200).send(updatedTarget)
            }
          })
        //   .then((updatedTarget) => {
        //       console.log(updatedTarget)
        //   })
          .catch((err) => {
            res.status(404).send(`err: ${err}`);
          });
      });

      app.post("/events/addEvent", (req: Request, res: Response) => {
        addEvent(req.body)
          .then((data) => {
            res.status(201).send(data);
          })
          .catch((err) => {
            console.log(err);
          });
      });

      app.post("/events/addAttendee", (req: Request, res: Response) => {
        const { id, status, email, attName } = req.body;
        const newUser = {
          status: status,
          email: email,
          attName: attName,
          eventId: id,
        };
        addAttendee(newUser)
          .then((data) => {
            res.status(201).send(data);
          })
          .catch((err) => {
            console.log(err);
          });
      });

      connection();

      const server = app.listen(port, () => {
        console.log(`Listening at http://localhost:${port}`);
        resolve(server);
      });
    } catch (err) {
      reject(err);
    }
  });
