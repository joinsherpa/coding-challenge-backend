import { Router, Request, Response } from "express";
const eventRouter = Router();

import q = require("./types/ReqQuery");
const { getEvents,getEventById } = require("./Services/eventServices");

eventRouter.get(
  "/",
  async (
    req: Request<unknown, unknown, unknown, q.ReqQuery>,
    res: Response
  ) => {
    const { query } = req;
    getEvents(query)
      .then((events: any) => {
        res.status(200).json(events);
      })
      .catch((err: string) => {
        res.status(403).json({ message: err });
      });
  }
);

eventRouter.get("/:eventId", async (req: Request, res: Response) => {
  getEventById(req.params.eventId)
      .then((event: any) => {
        res.status(200).json(event);
      })
      .catch((err: string) => {
        res.status(403).json({ message: err });
      });
});

module.exports = eventRouter;
