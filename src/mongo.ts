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

interface Event {
      name: string,
      isOutside: boolean,
      location: string,
      date: number,
      organizer: Organizer,
      attendee: Types.DocumentArray<Attendee>
}

interface Organizer {
    name: string
}

interface Attendee {
    status: string,
    email: string,
    attName: string
}

const organizerSchema = new Schema<Organizer>({
    name: String,
})

const attendeeSchema = new Schema<Attendee>({
  status: String,
  email: String,
  attName: String
})

const eventSchema = new Schema<Event>({
  name: {type: String, required: true},
  isOutside: {type: Boolean, required: false},
  location: {type: String, required: true},
  date: {type: Number, required: true},
  organizer: {type: organizerSchema, required: false},
  attendee: {type: [attendeeSchema], required: false }
})

const attendeeModel = model<Attendee>('attendee', attendeeSchema);

const organizerModel = model<Organizer>('organizer', organizerSchema);

const eventsModel = model<Event>('event', eventSchema);

export const getAllEvents = () =>  {
  return eventsModel.find({})
}

export const getEventDetails = () => {

}
export const addEvent = (newEvent: Event) => {
  return eventsModel.create({
    name: "Test Event 1",
    isOutside: false,
    location: "USA|DETROIT",
    date: 1653410177768,
    organizer: {name: "Dan Brown"},
    attendee: []
  })
}

export const addAttendee = (id: string, attendee: Attendee) => {
  return eventsModel.updateOne({_id: id}, { $push: { attendee }})
}


