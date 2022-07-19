import { IUser } from './user.interface';
import { IRSVP } from './rsvp.interface';
import { IWeather } from './weather.interface';

export interface IEvent {
    id: string;
    name: string;
    location: string;
    date: number | Date;
    isOutside: boolean;
    organizer: string | IUser;
    attendees: (string | IRSVP)[];
    weather?: IWeather;
}
