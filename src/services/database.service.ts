import {join} from "path"
import {Database} from "sqlite3"

let db: Database

const dbLocation = join(__dirname, '../../data/myDb.db')

const getDBConnection = (): Database => {

    if(!db) {
        const sqlite3 = require('sqlite3').verbose();
        db = new sqlite3.Database(dbLocation)
    }
    return db
}

export const initializeDB = async (): Promise<void> => {
    // Initialize DB tables
    const eventsTableQuery = 'CREATE TABLE IF NOT EXISTS events (id integer primary key autoincrement, name string, location string, date timestamp, isOutside boolean, organizer string, _created timestamp default current_timestamp)'
    const personTableQuery = 'CREATE TABLE IF NOT EXISTS users (name string primary key, _created timestamp default current_timestamp)'
    const rsvpTableQuery = 'CREATE TABLE IF NOT EXISTS rsvp (id integer primary key autoincrement, invitee string, event integer, status number, _latest timestamp, _created timestamp default current_timestamp, foreign key(invitee) references users(name), foreign key(event) references events(id))'

    // await queryDB('DROP TABLE events;')
    // await queryDB('DROP TABLE users;')
    // await queryDB('DROP TABLE rsvp;')

    await queryDB(eventsTableQuery);
    await queryDB(personTableQuery);
    await queryDB(rsvpTableQuery);
    return;
}

// Gets rid of the .then() massive blocks
export const queryDB = async (q: string, params: any[] = []): Promise<any> => {
    const db = getDBConnection();
    return new Promise<any>((res, rej) => {
        return db.run(q, params, (err: Error | null, data: any) => {
            return err ? rej(err) : res(data);
        })
    })
}
export const fetchDB = async (q: string): Promise<any> => {
    const db = getDBConnection();
    return new Promise<any>((res, rej) => {
        return db.all(q, (err: Error | null, data: any) => {
            return err ? rej(err) : res(data);
        })
    })
}
