import "reflect-metadata"
import { join } from "path"
import { DataSource } from "typeorm"
import { Organizer } from "./entity/Organizer"
import { Location } from "./entity/Location"
import { Invitee } from "./entity/Invitee"
import { Event } from "./entity/Event"
import { faker } from '@faker-js/faker';
import { Invitation, RSVPStatus } from "./entity/Invitation"

const DB_LOCATION = process.env.DB_LOCATION || join(__dirname, '../data/myDb.db')

const AppDataSource = new DataSource({
    type: "sqlite",
    database: DB_LOCATION,
    entities: [Organizer, Location, Invitee, Event, Invitation],
    synchronize: true,
    logging: false,
})

export default AppDataSource

export const initializeDB = async (): Promise<DataSource | null> => {
    try {
        await AppDataSource.initialize()
        console.log("Data Source has been initialized!")
        return AppDataSource
    } catch (err) {
        console.error("Error during Data Source initialization", err)
    }
    return null
}
