import { NextFunction, Request, Response } from 'express';

export function EventsQuerySanity(req: Request, res: Response, next: NextFunction) {
    // ensuring passed query params are of the right type and format
    let { from, until, index, count } = req.query;

    if (from && isNaN(new Date(<string>from).getTime())) {
        return res.status(400).json({
            error: 'Query \'from\' is not a recognizable date format'
        });
    } else {
        req.query.from = from ? new Date(<string>from).getTime().toString() : Date.now().toString()
    }

    if (until && isNaN(new Date(<string>until).getTime())) {
        return res.status(400).json({
            error: 'Query \'until\' is not a recognizable date format'
        });
    }

    if (index && !((/^-?\d+$/.test(<string>index)) || +index < 1)) {
        return res.status(400).json({
            error: 'Query \'index\' must be a number value and more than 0'
        });
    }

    if (count && !((/^-?\d+$/.test(<string>count)) || +count < 1)) {
        return res.status(400).json({
            error: 'Query \'count\' must be a number value and more than 0'
        });
    }

    next();
}
