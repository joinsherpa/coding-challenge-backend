import { response } from 'express';
import { getDefaultSettings } from 'http2';
import React , { useState } from 'react';
import { URLSearchParams } from 'url';
import axios from 'axios';
import FindEvents from './components/findEvents';
import EventsList from './components/eventsList';

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

const App: React.FC = () => {
  const [beginDateRange, setBeginDateRange] = useState<Date | null>(null);
  const [endDateRange, setEndDateRange] = useState<Date | null>(null);
  const [eventList, setEventList] = useState<EventObj[] | null>(null);

  function getEvents(date1?: Date, date2?: Date): void {
    let url = new URL('http://localhost:4040/events');
    const fromDate = date1 ? Math.floor(date1.getTime()/1000) : null;
    const toDate = date2 ? Math.floor(date2.getTime()/1000): null;
    const params = {params: {from: fromDate, to: toDate}};

    axios.get('http://localhost:4040/events', params)
      .then((eventList)=> {
        if (date1) {
          setBeginDateRange(date1)
        }
        if (date2) {
          setEndDateRange(date2)
        }
        setEventList(eventList.data)
      })
      .catch((err)=> {
        console.log(err)
      })
  }

  return (
    <>
      <h1>Event Headquarters</h1>
      <FindEvents getEvents={getEvents}/>
      <EventsList
        beginDate={beginDateRange}
        endDate={endDateRange}
        eventList={eventList}
      />
    </>
  );
};

export default App;