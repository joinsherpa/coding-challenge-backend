import mongoose, { Schema, model, connect, Types } from 'mongoose';

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
      name: string,
      isOutside: boolean,
      location: string,
      date: number,
      organizer: Organizer,
      attendees: Types.DocumentArray<Attendee>
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

export const getAllEvents = (from?: number, to?: number) =>  {
  //if both args are valid
  if (from && to) {
    console.log(from, to)
    return eventsModel.find({date: {$gte: from, $lte : to}})
  }
  //if 'from' is valid, but 'to' is not
  else if (from && !to) {
    console.log('2')
    return eventsModel.find({date: {$gte: from}})
  }
  //if both are invalid
  else {
    let currTime = Number(new Date());
    // console.log('currTime: ', typeof currTime, currTime)
    return eventsModel.find({date: {$gte: currTime}})
  }
}

export const getEventDetails = (eventId: string) => {
  return eventsModel.find({"_id": eventId})
}

export const addAttendee = (newAttendee: Attendee) => {
//if time, check for duplicates prior to adding
  return attendeeModel.findOneAndUpdate({email: newAttendee.email, eventId: newAttendee.eventId}, newAttendee, {new: true, upsert: true})
}

export const getAllAttendees = (id: string) => {
  return attendeeModel.find({"eventId": id})
}






