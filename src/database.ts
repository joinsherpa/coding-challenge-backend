import "reflect-metadata"
import { join } from "path"
import { DataSource } from "typeorm"
import { Organizer } from "./entity/Organizer"
import { Location } from "./entity/Location"
import { Invitee } from "./entity/Invitee"
import { Event } from "./entity/Event"
import { faker } from '@faker-js/faker';
import { Invitation } from "./entity/Invitation"

const DB_LOCATION = process.env.DB_LOCATION || join(__dirname, '../data/myDb.db')

const AppDataSource = new DataSource({
    type: "sqlite",
    database: DB_LOCATION,
    entities: [Organizer, Location, Invitee, Event, Invitation],
    synchronize: true,
    logging: true,
})

export default AppDataSource

export const initializeDB = async (): Promise<DataSource | null> => {
    try {
        await AppDataSource.initialize()
        
        const organizers = Array.from(new Array(100)).map(() : Partial<Organizer> => {
            return { name: faker.name.firstName() + ' ' + faker.name.lastName() }
        })
        const locations = Array.from(new Array(100)).map(() : Partial<Location> => {
            return { name: faker.address.country() }
        })
        await AppDataSource
        .createQueryBuilder()
        .insert()
        .into(Organizer)
        .values(organizers)
        .execute()
        await AppDataSource
        .createQueryBuilder()
        .insert()
        .into(Location)
        .values(locations)
        .execute()
        console.log("Data Source has been initialized!")
        return AppDataSource
    } catch (err) {
        console.error("Error during Data Source initialization", err)
    }
    return null
}
