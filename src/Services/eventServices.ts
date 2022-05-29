import q = require("../types/ReqQuery");
import { Prisma, PrismaClient } from "@prisma/client";
const differenceInDays = require("date-fns/differenceInDays");
const prisma = new PrismaClient();
const axios = require("axios");
module.exports.getEvents = function (query: q.ReqQuery) {
  return new Promise(async (resolve, reject) => {
    let or = {};

    if (
      (query.from || "").match(/^-?\d+$/) &&
      (query.until || "").match(/^-?\d+$/)
    ) {
      or = {
        OR: [
          {
            date: {
              lte: parseInt(query.until || ""),
              gte: parseInt(query.from || ""),
            },
          },
        ],
      };
    } else if ((query.from || "").match(/^-?\d+$/)) {
      or = {
        OR: [
          {
            date: {
              gte: parseInt(query.from || ""),
            },
          },
        ],
      };
    } else if ((query.until || "").match(/^-?\d+$/)) {
      or = {
        OR: [
          {
            date: {
              lte: parseInt(query.until || ""),
            },
          },
        ],
      };
    }

    let paginationOpt = null;

    if (
      (query.skip || "").match(/^-?\d+$/) &&
      (query.take || "").match(/^-?\d+$/)
    )
      paginationOpt = {
        skip: parseInt(query.skip || ""),
        take: parseInt(query.take || ""),
      };

    console.log(paginationOpt);
    const events = await prisma.event.findMany({
      //offset pagination
      ...paginationOpt,
      where: {
        ...or,
      },

      include: {
        organizer: true,
      },
    });

    if (!events) {
      reject(`Unable to find events`);
    }

    events.forEach((e) => {
      (<any>e).attendees = [];
    });

    resolve(events);
  });
};

module.exports.getEventById = function (id: string) {
  return new Promise(async (resolve, reject) => {
    const event = await prisma.event.findUnique({
      where: {
        event_id: parseInt(id),
      },
      include: {
        organizer: true,
      },
    });

    if (event) {
      (<any>event).attendees = [];
      (<any>event).weather = { temperatureInDegreesCelcius: 0 };
      const dayDiff = differenceInDays(event?.date, Date.now());
      if (dayDiff <= 7 && dayDiff >= 0 && event.isOutside === true) {
        await axios
          .get(
            `http://api.weatherstack.com/current?access_key=660adf92f3c5f24603ae12e9282541a7&query=${
              event.location.split("|")[1]
            }&forecast_days=1&hourly=1`
          )
          .then((response: any) => {
            // Cant get a chance of rain because of the different subscription plan
            //(<any>event).weather.chanceOfRain = response.data.forecast.hourly.chanceofrain;
            (<any>event).weather.temperatureInDegreesCelcius =
              response.data.current.temperature;
          });
      } else {
        (<any>event).weather = null;
      }
    } else {
      reject(`Unable to find event with #${id}`);
    }
    resolve(event);
  });
};
