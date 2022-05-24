import React, { useState, useEffect } from 'react';
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
};

const EventsList: React.FC<EventsListProps> = ({beginDate, endDate, eventList}) => {

  useEffect(() => {
    console.log('in eventlist: ', beginDate, endDate, eventList)
  }, [eventList])

  return (
    <>
    {beginDate ? <h1>{`Events from ${beginDate.toDateString()}`}</h1> : null}
    {endDate ? <h1>{` to ${endDate.toDateString()}`}</h1> : null}
    <OneEvent eventList={eventList}/>
    </>
  );
};

export default EventsList;