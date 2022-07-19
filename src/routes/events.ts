import { Request, Response, Router } from 'express';

class EventRoutes {
    static getEvents(req: Request, res: Response) {
        res.send('ok');
    }

    static getEvent(req: Request, res: Response) {

    }
}

export const EventRouter: Router = Router();

EventRouter.get('/', EventRoutes.getEvents);
EventRouter.get('/:id', EventRoutes.getEvent);
