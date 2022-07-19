import { Request, Response, Router } from 'express';
import { fetchDB } from '../services/database.service';
import { EventQuerySanity, EventsQuerySanity } from '../middlewares/dataSanity.middleware';
import { IEvent } from '../models/event.interface';
import { WeatherService } from '../services/weather.service';

class EventRoutes {
    static async getEvents(req: Request, res: Response) {
        try {
            const query = 'SELECT events.*, rsvp.status, rsvp.invitee as invitee, rsvp._created as invited_at, rsvp._latest as latest_at from events LEFT JOIN rsvp ON rsvp.event = events.id';
            let where;

            /**
             * index: start count for pagination, defaults to 1
             * count: number of results to return, defaults to unlimited
             */
            let { from, until, index, count } = req.query;

            where = ' WHERE events.date >= ' + from;

            if (until) {
                where += ' AND events.date <= ' + new Date(<string>until).getTime();
            }

            if (index) {
                where += ' AND events.id >= ' + index
            }

            const qResults = await fetchDB(query + where)
            const formattedResult: { [key: string]: IEvent | any } = {};
            let uniqueEvents = 0; // helps limit for loop
            for (const event of qResults) {
                if (!formattedResult[event.id]) {
                    uniqueEvents++;
                    formattedResult[event.id] = {
                        id: event.id,
                        name: event.name,
                        date: new Date(event.date),
                        isOutside: event.isOutside,
                        attendees: [],
                        organizer:  {
                            id: event.organizer, // To keep the same response as requested in the README. More explanation under user.interface.ts
                            name: event.organizer,
                        }
                    }
                }

                // attendee array
                if (event.invitee) {
                    formattedResult[event.id].attendees.push({
                        name: event.invitee,
                        status: event.status,
                    })
                }
                if (count && +count <= uniqueEvents) {
                    break;
                }
            }
            return res.json({results: Object.values(formattedResult)});
        } catch (err: any) {
            return res.status(500).json({
                error: err.message || err
            })
        }

    }

    static async getEvent(req: Request, res: Response) {
        try {
            const event = await fetchDB('SELECT events.*, rsvp.invitee, rsvp.status FROM events left join rsvp on rsvp.event = events.id WHERE events.id = ' + req.params.id)
            const { id, name, date, isOutside, organizer, location } = event[0];
            const daysTilEvent = Math.floor((date - Date.now()) / 86400000); // Static number represents a single day in milliseconds
            let weather;

            if (event.length === 0) {
                return res.status(400).json({error: 'Unable to find event with id: ' + req.params.id});
            }

            // If event is outside and starting within the next 7 days (inclusive of the current day)
            if (isOutside && daysTilEvent >= 0 && daysTilEvent <= 7) {
                weather = await WeatherService.fetchForecast(location, Math.floor(daysTilEvent));
            }
            const formatted: IEvent | any = {
                id,
                name,
                date: new Date(date),
                isOutside,
                attendees: [],
                organizer: {
                    id: organizer,
                    name: organizer,
                },
                weather,
            }

            // Populate RSVP
            for (const e of event) {
                if (e.invitee) {
                    formatted.attendees.push({
                        name: e.invitee,
                        status: e.status,
                    })
                }
            }
            return res.send(formatted);
        } catch(err: any) {
            return res.status(500).json({
                error: err.message || err
            })
        }
    }
}

export const EventRouter: Router = Router();

EventRouter.get('/', EventsQuerySanity, EventRoutes.getEvents);
EventRouter.get('/:id', EventQuerySanity, EventRoutes.getEvent);
