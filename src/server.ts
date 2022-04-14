import 'dotenv/config'
import 'dotenv/config'

import express from "express"
import { Request, Response } from "express"
import {Server} from "http";
import axios from "axios";
import { Between, MoreThan } from "typeorm";
import {initializeDB} from "./database";
import { Event } from "./entity/Event";
import { Invitation } from "./entity/Invitation";
import { Organizer } from "./entity/Organizer";

interface EventsListingQuery {
    page:number
    pageSize: number
    from: number
    until: number
}
interface EventResponse extends SherpaResp { 
    id: number
    name: string
    date: number
    isOutside: boolean
    attendees?: Invitation[]
    organizer: Organizer
    weather?: Weather|null
}
interface Weather {
    temperatureInDegreesCelcius: number
    chanceOfRain: number
}
interface SherpaResp {
    visaRequirements?: string | null
    proofOfVaccineRequired?: boolean | null
}

async function getSherpa(citizenship:string, destination:string) : Promise<SherpaResp | null> {
    try{
        const API_KEY = process.env.SHERPA_API_KEY
        const url = 'https://requirements-api.joinsherpa.com/v2/entry-requirements'
        const resp = await axios.get(url, { params: { key: API_KEY, citizenship, destination }, timeout: 1000 })
        const isVisaRequired = resp.data.visa[0].requirement !== "NOT_REQUIRED"
        return {
            visaRequirements: isVisaRequired && resp.data.visa[0].textual.text.join(' '),
            proofOfVaccineRequired: resp.data.vaccination !== {}
        }
    }catch(err){
        return null
    }
}
async function getWeather(location:string, date:number): Promise<Weather|null> {
    try{
        const API_KEY = process.env.WEATHER_API_KEY
        const url = `https://api.weatherapi.com/v1/forecast.json`
        
        const resp = await axios.get(url, { params: { key: API_KEY, q: location, unixdt: date/1000 }, timeout: 1000 })
        return {
            temperatureInDegreesCelcius: resp.data.forecast.forecastday[0].day.avgtemp_c,
            chanceOfRain: resp.data.forecast.forecastday[0].day.daily_chance_of_rain
        }
    }
    catch(err){
        return null
    }
}
export const start = async (): Promise<Server> => new Promise(async (resolve, reject) => {
    try {
        const port = 4040
        const app = express()
        const db = await initializeDB()
        if( !db) {
            return reject("Database not connected")
        }
        app.get('/events', async (req:Request<any, any, any, EventsListingQuery>, res:Response) => {
            const pageSize = req.query.pageSize || 10
            const page = req.query.page || 1
            const from = req.query.from || +new Date()
            const until = req.query.until

            let where = { date: MoreThan(from) }
            if(until){
                where.date = Between(from, until)
            }
            let events = await db.getRepository(Event).find({
                where,
                relations: {
                    location: true,
                    organizer: true,
                    invitations: true
                },
                take: pageSize,
                skip: (page - 1 ) * pageSize
            })
            if(events?.length === 0){
                return res.json({ results: [] })
            }
            // get the 7th day timestamp
            const now = new Date()
            const next7days = +now.setDate(now.getDate() + 7)

            const eventsPromises = await Promise.allSettled(events.map(async ev => {
                let event : EventResponse = ev
                event.visaRequirements = null
                event.proofOfVaccineRequired = null
                // Request Weather Data fi the Event is between now and next 7 days 
                // Or if the event is outside
                const isEventInNext7Days = (+new Date()) >= event.date && event.date <= next7days
                if(isEventInNext7Days || event.isOutside){
                    event.weather = await getWeather(ev.location.name, ev.date)
                }

                // Request Sherpa if the location is not in Canada and if it's not remote
                if(! ev.location.name.startsWith('CAN') && (ev.location.name.indexOf('REMOTE') === -1 )){
                    const sherpaResp  = await getSherpa('CAN', ev.location.name.split('|')[0])
                    if(sherpaResp){
                        event.visaRequirements = sherpaResp.visaRequirements
                        event.proofOfVaccineRequired = sherpaResp.proofOfVaccineRequired                        
                    }
                }
                return event
            }))
            const eventsData = eventsPromises
                .filter((e): e is PromiseFulfilledResult<EventResponse> => e.status === "fulfilled")
                .map(e => e.value as EventResponse) as EventResponse[]

            res.json({ results: eventsData })
        })
        app.get('/events/:eventId', async (req:Request, res:Response) => {
            const event = await db?.getRepository(Event).findOne({
                where : {
                    id: parseInt(req.params.eventId),
                },
                relations: {
                    location: true,
                    organizer: true
                }
            })

            res.json(event)
        })

        const server = app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`)
            resolve(server)
        })
    } catch (err) {
        reject(err)
    }
})
