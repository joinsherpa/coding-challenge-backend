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
  const [eventList, setEventList] = useState<EventObj[] | []>([]);
  const [pageIds, setPageIds] = useState<String[]>(['']);
  const [page, setPage] = useState<number>(0);

  function getEvents(date1: Date, date2?: Date, lastId?: String): void {
    const fromDate = date1?.getTime();
    const toDate = date2 ? date2.getTime(): '';
    const id = lastId || '';

    axios.get<EventObj[] | []>('http://localhost:4040/events', {params: {from: fromDate, to: toDate, lastId: id}})
      .then((returnedEvents)=> {
        const returnedLength = returnedEvents.data.length;
        const lastEvent = returnedEvents.data[returnedLength - 1];

        if (date1 && !beginDateRange) {
          setBeginDateRange(date1)
        }
        if (date2 && !endDateRange) {
          setEndDateRange(date2)
        }

        if (returnedLength === 5 && !pageIds.includes(lastEvent._id)) {
          setPageIds((prev) => [...pageIds, lastEvent._id])
        }
        setEventList(returnedEvents.data)

      })
      .catch((err)=> {
        console.log(err)
      })
  }

  function newPageResults(direction: String) {
    if (direction === 'previous') {
      getEvents(beginDateRange || new Date(), endDateRange! , pageIds[page - 2])
    }
    if (direction === 'next') {
      getEvents(beginDateRange || new Date(), endDateRange! , pageIds[pageIds.length - 1])
    }
  }

  const onPageChange = function(direction: String ) {
    //Next: not at end of results
    if (direction === 'next' && eventList.length === 5) {
      setPage((prev) => prev + 1)
      newPageResults('next')
    }

    //Previous: not at beginning of results
    if (direction === 'previous' && page >= 1) {
      setPage((prev) => prev - 1)
      newPageResults('previous')
    }
  }

  function addEventDetails(detailedEvent: EventObj) {
    if (eventList) {
      for (var i=0; i < eventList?.length; i++) {
        let currId = eventList[i]._id;
        let newId = detailedEvent._id;
        if (currId === newId) {
          setEventList((prevList) => {
            let copy = [...(prevList || [])];
            copy[i] = detailedEvent;
            return copy
          })
        }
      }
    }
  }

  return (
    <div className='main-container'>
      <h1>Event Headquarters</h1>
      <div className='top-container'>
        <FindEvents getEvents={getEvents}/>
      </div>
      <div className='events-container'>
      <EventsList
          beginDate={beginDateRange}
          endDate={endDateRange}
          eventList={eventList}
          addEventDetails={addEventDetails}
          onPageChange={onPageChange}
          page={page}
        />
      </div>
    </div>
  );
};

export default App;