import React, { useState } from "react";
import axios from "axios";
import OneEvent from "./oneEvent";

type EventObj = {
  _id: String;
  name: String;
  isOutside: Boolean;
  location: String;
  date: Date;
  organizer: { name: String };
  attendees: [];
  __v: Number;
};

type EventsListProps = {
  beginDate: Date | null;
  endDate: Date | null;
  eventList: EventObj[] | [];
  addEventDetails: (detailedEvent: EventObj) => void;
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

  return (
    <div className="all-events-container">
      <span className="event-date-range">
        {page > 0 ? <button onClick={()=>onPageChange('previous')}>Previous</button> : null}
        {beginDate ? (
          <h3>{`Events from ${beginDate.toDateString()}`}</h3>
        ) : null}
        {endDate ? <h3>{` to ${endDate.toDateString()}`}</h3> : null}
        {eventList.length >= 5 ? <button onClick={()=>onPageChange('next')}>Next</button> : null}
      </span>
      <OneEvent eventList={eventList} retrieveDetails={retrieveDetails} />
    </div>
  );
};

export default EventsList;
