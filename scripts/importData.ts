interface Organizer {
    name: string
}

interface Event {
    name: string,
    isOutside: boolean,
    location: string,
    date: number,
    organizer: Organizer,
    attendees: Attendees[]
}

interface Attendees {
    status: string,
    email: string,
    attName: string,
    Event_id: number
}

export const importData = () => {
    // Import the data in json format and save in database
}

importData()
