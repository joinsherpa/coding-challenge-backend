import { response } from 'express';
import { getDefaultSettings } from 'http2';
import React , { useState } from 'react';
import { URLSearchParams } from 'url';
import axios from 'axios';
import FindEvents from './components/findEvents';
import EventsList from './components/eventsList';
import { Event, DetailedEvent } from './helpers/interfaces';
import { set } from 'mongoose';

const App: React.FC = () => {
  //store current search range
  const [beginDateRange, setBeginDateRange] = useState<Date | null>(null);
  const [endDateRange, setEndDateRange] = useState<Date | null>(null);
  //stores one page of results
  const [eventList, setEventList] = useState<Event[] | DetailedEvent[] | []>([]);
  //stores the _id of the last event on each page of results. used for pagination
  const [pageIds, setPageIds] = useState<string[]>(['']);
  //stores current page number. used for pagination calculations with 'previous' and 'next' buttons
  const [page, setPage] = useState<number>(1);

  function getEvents(date1: Date, date2?: Date, lastId?: string): void {
    const fromDate = date1?.getTime();
    const toDate = date2 ? date2.getTime(): '';
    const id = lastId || '';

    axios.get<Event[] | []>('http://localhost:4040/events', {params: {from: fromDate, to: toDate, lastId: id}})
      .then((returnedEvents)=> {
        const returnedLength = returnedEvents.data.length;
        const lastEvent = returnedEvents.data[returnedLength - 1];

        //check if a new date range has been selected
        if (date1) {
          if (!beginDateRange || date1 !== beginDateRange) {
            setBeginDateRange(date1)
          }
        }
        if (date2) {
          if (!endDateRange || date2 !== endDateRange) {
            setEndDateRange(date2)
          }
        } else {
          setEndDateRange(null)
        }

        //check if pageIds contains the last id of current results, add if not present.
        if (returnedLength === 5 && !pageIds.includes(lastEvent._id!)) {
          setPageIds((prev) => [...pageIds, lastEvent._id!])
        }
        setEventList(returnedEvents.data)

      })
      .catch((err)=> {
        console.log(err)
      })
  }

  //handler for
  function newPageResults(direction: string) {
    if (direction === 'previous') {
      getEvents(beginDateRange || new Date(), endDateRange! , pageIds[page - 2])
    }
    if (direction === 'next') {
      getEvents(beginDateRange || new Date(), endDateRange! , pageIds[page])
    }
  }

  //handler for click of "next" or "previous" buttons. validates if at begin or end of results as well.
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

  //updates the correct event stored in the eventList state
  function addEventDetails(detailedEvent: Event) {
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