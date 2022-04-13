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
        const invitees = Array.from(new Array(100)).map(() : Partial<Invitee> => {
            return { email: faker.internet.email() }
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
        await AppDataSource
        .createQueryBuilder()
        .insert()
        .into(Invitee)
        .values(invitees)
        .execute()

        const dbLocations = await AppDataSource.getRepository(Location).find()
        const dbOranizers = await AppDataSource.getRepository(Organizer).find()
        const events = Array.from(new Array(100)).map(() : Partial<Event> => {
            return { 
                name: faker.word.noun(),
                isOutside: faker.datatype.boolean(),
                date: faker.random.arrayElement([faker.date.past().getTime(), faker.date.future().getTime()]),
                location: dbLocations[faker.datatype.number({ min: 0, max: dbLocations.length -1  })],
                organizer: dbOranizers[faker.datatype.number({ min: 0, max: dbOranizers.length -1 })]
            }
        })
        await AppDataSource
        .createQueryBuilder()
        .insert()
        .into(Event)
        .values(events)
        .execute()

        const dbInvitees = await AppDataSource.getRepository(Invitee).find()
        const dbEvents = await AppDataSource.getRepository(Event).find()
        
        const invitations = Array.from(new Array(100)).map(() : Partial<Invitation> => {
            return { 
                eventId: dbEvents[faker.datatype.number({ min: 0, max: dbEvents.length - 1 })].id,
                inviteeId: dbInvitees[faker.datatype.number({ min: 0, max: dbInvitees.length - 1 })].id,
                rsvpStatus: faker.random.objectElement(RSVPStatus)
            }
        })
        await AppDataSource
        .createQueryBuilder()
        .insert()
        .into(Invitation)
        .values(invitations)
        .execute()
        console.log("Data Source has been initialized!")
        return AppDataSource
    } catch (err) {
        console.error("Error during Data Source initialization", err)
    }
    return null
}
