import { IUser } from './user.interface';
import { IEvent } from './event.interface';
import { RSVP_STATUS } from '../enums/rsvpStatus.enum';

export interface IRSVP {
    id: number;
    invitee: string | IUser;
    event: number | IEvent;
    status: RSVP_STATUS;
    _created: number;
}
