import React, { useState } from "react";
import axios from "axios";
import OneEvent from "./oneEvent";
import { Event } from '../helpers/interfaces';

type EventsListProps = {
  beginDate: Date | null;
  endDate: Date | null;
  eventList: Event[] | [];
  addEventDetails: (detailedEvent: Event) => void;
  onPageChange: (direction: String) => void;
  page: Number;
};

const EventsList: React.FC<EventsListProps> = ({
  beginDate,
  endDate,
  eventList,
  addEventDetails,
  onPageChange,
  page
}) => {

  const prevButton = document.getElementById('prev-button')! as HTMLButtonElement;
  const nextButton = document.getElementById('next-button')! as HTMLButtonElement;

  const retrieveDetails = function(id: String) {
    axios
      .get(`http://localhost:4040/events/${id}`)
      .then((results) => {
        addEventDetails(results.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // conditional rendering for "previous" and "next" buttons
  if (eventList.length === 5 && nextButton != null) {
    nextButton.style.visibility = 'visible'
  } else if (eventList.length < 5 && nextButton != null) {
    nextButton.style.visibility = 'hidden'
  }

  if (page > 1 && prevButton != null) {
    prevButton.style.visibility = 'visible'
  } else if (page <= 1  && prevButton != null) {
    prevButton.style.visibility = 'hidden'
  }

  return (
    <div className="all-events-container">
      <div className="event-date-range">
        <button id="prev-button" onClick={()=>onPageChange('previous')}>Previous</button>
        <span>
        {beginDate ? (
          <h3>{`Events from ${beginDate.toDateString()}`}</h3>
        ) : null}
        {endDate ? <h3>{` to ${endDate.toDateString()}`}</h3> : null}
        </span>
        <button id="next-button" onClick={()=>onPageChange('next')}>Next</button>
      </div>
      <OneEvent eventList={eventList} retrieveDetails={retrieveDetails} />
    </div>
  );
};

export default EventsList;
