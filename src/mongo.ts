import mongoose, { Schema, model, connect, Types, PaginateModel } from 'mongoose';
import { paginate } from 'mongoose-paginate-v2';

export const connection = () => {
  connect('mongodb://localhost/AllEvents')
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((err) => {
    console.log('Unable to connect to MongoDB:', err)
  });
}

export interface Event {
      _id?: string,
      name: string,
      isOutside: boolean,
      location: string,
      date: number,
      organizer: Organizer,
      attendees: Attendee[];
}

export interface DetailedEvent {
  _id? : string,
  name: string,
  isOutside: boolean,
  location: string,
  date: number,
  organizer: Organizer,
  attendees: Attendee[];
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

const organizerSchema = new Schema<Organizer>({
    name: {type: String},
})

const attendeeSchema = new Schema<Attendee>({
  status: {type: String},
  email: {type: String, index: true},
  attName: {type: String},
  eventId: {type: String}
})

const eventSchema = new Schema<Event>({
  name: {type: String, required: true, index: { unique: false }},
  isOutside: {type: Boolean, required: false},
  location: {type: String, required: true},
  date: {type: Number, required: true},
  organizer: {type: organizerSchema, required: false},
  attendees: {type: [attendeeSchema], required: false }
})

const attendeeModel = model<Attendee>('attendee', attendeeSchema);

const organizerModel = model<Organizer>('organizer', organizerSchema);

const eventsModel = model<Event>('event', eventSchema);

export const addEvent = (newEvent: Event) => {
  return eventsModel.create(newEvent)
}

export const getAllEvents = (from?: number, to?: number, lastId?: string) =>  {
  //pagination is achieved by utilizing the objectid. These ids are indexed and incremented making them perfect for scalable pagination.

  //if both 'from' and 'to' args are valid
  if (from && to) {
    return (lastId
    ? eventsModel.find({date: {$gte: from, $lte: to}, _id: {$gt: `ObjectId("${lastId}")`}}).limit(5)
    : eventsModel.find({date: {$gte: from, $lte: to}}).limit(5))
  }
  //if 'from' is valid, but 'to' is not
  else if (from && !to) {
    return (lastId
      ? eventsModel.find({date: {$gte: from}, _id: {$gt: `ObjectId("${lastId}")`}}).limit(5)
      : eventsModel.find({date: {$gte: from}}).limit(5)
      )

  }
  //if both 'from' and 'to' are invalid
  else {
    let currTime = Math.floor(new Date().getTime() / 1000);
    return (lastId
      ? eventsModel.find({date: {$gte: currTime}, _id: {$gt: `ObjectId("${lastId}")`}}).limit(5)
      : eventsModel.find({date: {$gte: from}}).limit(5)
      )
  }
}

export const getEventDetails = (eventId: string, lastId: string) => {
  return eventsModel.find({"_id": eventId})
}

export const addAttendee = (newAttendee: Attendee) => {
//if time, check for duplicates prior to adding
  return attendeeModel.findOneAndUpdate({email: newAttendee.email, eventId: newAttendee.eventId}, newAttendee, {new: true, upsert: true})
}

export const getAllAttendees = (id: string) => {
  return attendeeModel.find({"eventId": id})
}






