import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SpinnerCircular } from 'spinners-react';
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

  const retrieveWeather = function(location: string, id: string) {
    const buttonEl = document.querySelector(`.class${id}`)!;
    buttonEl.remove()
    const buttonContainerEl = document.getElementById(`id${id}`)!;
    buttonContainerEl.innerText = "Retrieving Event Weather";
    axios.get('http://localhost:4040/weather', {params: {weatherLoc: location}})
    .then((results)=> {
      const classTemp = `.${id}`;

      //correctly retrieving weather data per location, need to cross check it with event date and then render
      console.log(results.data[0])
      buttonContainerEl.innerText = 'works'
    })
    .catch((err)=> {
      console.log(err)
    })
  }

  return (
    <div className='all-events-container'>
    {beginDate ? <h1>{`Events from ${beginDate.toDateString()}`}</h1> : null}
    {endDate ? <h1>{` to ${endDate.toDateString()}`}</h1> : null}
    <OneEvent eventList={eventList} retrieveWeather={retrieveWeather}/>
    </div>
  );
};

export default EventsList;