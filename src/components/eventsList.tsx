import React from 'react';
import axios from 'axios';
import OneEvent from './oneEvent';

type EventObj = {
  _id: String;
  name: String;
  isOutside: Boolean;
  location: String;
  date: Date;
  organizer: {name: String};
  attendees: [];
  __v: Number;
}

type EventsListProps = {
  beginDate: Date | null;
  endDate: Date  | null;
  eventList: EventObj[] | null;
  addEventDetails: (detailedEvent: EventObj) => void;
};

const EventsList: React.FC<EventsListProps> = ({beginDate, endDate, eventList, addEventDetails}) => {

  const retrieveDetails = function(id: String) {
    axios.get(`http://localhost:4040/events/${id}`)
    .then((results)=> {
      addEventDetails(results.data)
    })
    .catch((err)=> {
      console.log(err)
    })
  }

  return (
    <div className='all-events-container'>
    {beginDate ? <h1>{`Events from ${beginDate.toDateString()}`}</h1> : null}
    {endDate ? <h1>{` to ${endDate.toDateString()}`}</h1> : null}
    <OneEvent
      eventList={eventList}
      retrieveDetails={retrieveDetails}
    />
    </div>
  );
};

export default EventsList;