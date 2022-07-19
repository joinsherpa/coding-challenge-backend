import { Request, Response, Router } from 'express';
import { fetchDB } from '../services/database';
import { EventsQuerySanity } from '../middlewares/dataSanity.middleware';
import { IEvent } from '../models/event.interface';

class EventRoutes {
    static async getEvents(req: Request, res: Response) {
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
    }

    static getEvent(req: Request, res: Response) {

    }
}

export const EventRouter: Router = Router();

EventRouter.get('/', EventsQuerySanity, EventRoutes.getEvents);
EventRouter.get('/:id', EventRoutes.getEvent);
