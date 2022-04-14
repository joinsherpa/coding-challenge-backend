import 'dotenv/config'

import * as fs from "fs";
import { initializeDB } from "../src/database";
import { Organizer } from "../src/entity/Organizer";
import { Location } from "../src/entity/Location";
import { Event } from "../src/entity/Event";
interface IOrganizer {
    name: string
}

interface ILocation {
    name: string
}
interface IEvent {
    name: string,
    isOutside: boolean,
    location: ILocation,
    date: number,
    organizer: IOrganizer
}

function isEvent(e:any): e is IEvent {
    return (
        'name' in e &&
        'isOutside' in e &&
        'location' in e &&
        'date' in e &&
        'organizer' in e
    )
}
export const importData = async () => {
    const db = await initializeDB()
    if(! db){
        console.log('Database is connected')
        process.exit(1)
    }
    // Import the data in json format and save in database
    const DATA_LOCATION = process.env.DATA_FILE_LOCATION

    const stream = fs.createReadStream(DATA_LOCATION)
    let chunks: Buffer[] = []
    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk))
    }
    const data = JSON.parse(Buffer.concat(chunks).toString('utf-8')).map((e:any) => ({...e,  location: { name: e.location }}))
    for(const event of data) {
        if(isEvent(event)){
            let org = await db.getRepository(Organizer).findOne({ where: { name: event.organizer.name } })
            if(! org){
                org = await db.getRepository(Organizer).save(event.organizer)
            }
            let loc = await db.getRepository(Location).findOne({ where: { name: event.location.name } })
            if(! loc){
                loc = await db.getRepository(Location).save(event.location)
            }
            const createdEv = await db.getRepository(Event).save({
                name: event.name,
                date: event.date,
                isOutside: event.isOutside,
                organizer: org,
                location: loc
            })
            console.log(`Event: ${createdEv.name} with id: ${createdEv.id} is Saved!`)
        }
    }
}

importData()
