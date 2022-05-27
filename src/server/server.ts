import express, { Response, Request } from "express";
import cors from "cors";
import { Server } from "http";
import {
  connection,
  getAllEvents,
  getAllAttendees,
  addEvent,
  addAttendee,
  getEventDetails,
} from "../database/database";
import {
  Event,
  DetailedEvent,
  Weather,
  Organizer,
  Attendee
} from '../helpers/interfaces';
import { searchAddressHandler, GoogleGeocodingResponse } from "../helpers/geocoding";
import { getWeather } from "../helpers/weather";

export const start = async (): Promise<Server> =>
  new Promise(async (resolve, reject) => {
    try {
      const port = 4040;
      const app = express();
      app.use(cors());
      app.use(express.json());

      app.get("/events", async (req: Request, res: Response) => {
        try {
          //front end sends either an empty string indicating null value, or a stringified number of ms or Id
          const from = req.query.from !== "" ? +req.query.from! : 0;
          const to = req.query.to !== "" ? +req.query.to! : 0;
          const lastId =
            req.query.lastId !== "" ? (req.query.lastId as string) : "";
          const results = await getAllEvents(from, to, lastId);
          res.status(200).send(results);
        } catch (error) {
          res.status(404).send(`Err: ${error}`);
        }
      });

      app.get("/events/:eventId", async (req: Request, res: Response) => {
        try {
          //front end sends a string representing eventId
          const eventId = req.params.eventId;
          const currTime = new Date().getTime();
          //the 3 following values are updated after receiving responses from geocoding API and weather API if applicable.
          let attendeeList: Attendee[] = [];
          let targetEvent: Event;
          let updatedTarget: DetailedEvent;

          //Step1: get event specific attendees from attendees collection
          const attendeeRequest = await getAllAttendees(eventId);
          attendeeList = attendeeRequest;

          //Step 2: get specific event from allevents collection
          const eventDetailsRequest = await getEventDetails(eventId);
          eventDetailsRequest[0].attendees = attendeeList;
          targetEvent = eventDetailsRequest[0];
          const withinWindow =
            +targetEvent.date - +currTime < 604800000 &&
            +targetEvent.date - +currTime >= 0
              ? true
              : false;
          //only retrieve weather if within 7 days of event and event is outside
          if (withinWindow && targetEvent.isOutside) {
            const latLongResults = await searchAddressHandler(
              targetEvent.location
            );
            if (latLongResults.data.status === "OK") {
              const coordinates =
                latLongResults.data.results[0].geometry.location;
              //use latitude and longititude to get weather data from openweather api
              const weatherResults = await getWeather(
                coordinates.lat,
                coordinates.lng
              );
              const targetWeather = weatherResults.data.daily.forEach(
                (oneDay: any) => {
                  let oneDayTime = new Date(oneDay.dt * 1000).toDateString();
                  let eventTime = new Date(targetEvent.date).toDateString();
                  if (oneDayTime === eventTime) {
                    //creating new object with event details to return to front end
                    updatedTarget = {
                      _id: targetEvent._id,
                      name: targetEvent.name,
                      isOutside: targetEvent.isOutside,
                      location: targetEvent.location,
                      date: targetEvent.date,
                      organizer: targetEvent.organizer,
                      attendees: attendeeList,
                      weather: {
                        temperatureInDegreesCelcius: Math.round(
                          oneDay.temp.max - 273.15
                        ),
                        chanceOfRain:
                          Math.round(oneDay.pop * 100) || "Unknown Chance of Rain",
                      },
                    };
                    res.status(200).send(updatedTarget);
                  }
                }
              );
            }
          } else {
            //creating new object with event details to return to front end
            updatedTarget = {
              _id: targetEvent._id,
              name: targetEvent.name,
              isOutside: targetEvent.isOutside,
              location: targetEvent.location,
              date: targetEvent.date,
              organizer: targetEvent.organizer,
              attendees: attendeeList,
              weather: null,
            };
            res.status(200).send(updatedTarget);
          }
        } catch (error) {
          res.status(404).send(`Err: ${error}`);
        }
      });

      app.post("/events/addEvent", async (req: Request, res: Response) => {
        try {
          const newEventResult = await addEvent(req.body);
          res.status(201).send(newEventResult);
        } catch (error) {
          res.status(400).send(error);
        }
      });

      app.post("/events/addAttendee", async (req: Request, res: Response) => {
        try {
          const { id, status, email, attName } = req.body;
          const newUser = {
            status: status,
            email: email,
            attName: attName,
            eventId: id,
          };
          const newAttendeeResults = await addAttendee(newUser);
          res.status(201).send(newAttendeeResults);
        } catch (error) {
          res.status(400).send(error);
        }
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
