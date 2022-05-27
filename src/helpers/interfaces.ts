export interface Event {
  _id?: string,
  name: string,
  isOutside: boolean,
  location: string,
  date: number,
  organizer: Organizer,
  attendees?: Attendee[] | [];
  __v?: Number
}

export interface DetailedEvent {
  _id? : string,
  name: string,
  isOutside: boolean,
  location: string,
  date: number,
  organizer: Organizer,
  attendees?: Attendee[] | [];
  weather?: Weather | null;
}

export interface Weather {
  temperatureInDegreesCelcius: number;
  chanceOfRain: number | string;
}

export interface Organizer {
    name: string
}

export interface Attendee {
    status: string,
    email: string,
    attName: string,
    eventId: string
}