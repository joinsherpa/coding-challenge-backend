import events from '../data/data.json';
import { queryDB } from '../src/services/database.service';

interface Organizer {
    name: string
}

interface Event {
    name: string,
    isOutside: boolean,
    location: string,
    date: number,
    organizer: Organizer
}

export const importData = async () => {
    for (const e of <Event[]>events) {
        if (e.organizer.name) {
            await queryDB('INSERT OR IGNORE INTO users (name) VALUES (?)', [e.organizer.name]);
            if (e.name && e.location && typeof e.isOutside === 'boolean') {
                await queryDB('INSERT OR IGNORE INTO events (name, location, isOutside, date, organizer) VALUES (?, ?, ?, ?, ?)',
                    [
                        e.name,
                        e.location,
                        e.isOutside,
                        e.date,
                        e.organizer.name
                    ]);
            }
        }


    }
    return 'done';
}

importData().then(console.log);
