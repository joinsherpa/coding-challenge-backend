import React, { useState } from 'react';

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

type oneEventProps = {
  eventList: EventObj[] | null;
  retrieveDetails: (id: String) => void;
  addEventDetails: (id: String, detailedEvent: Object) => void;
};

const OneEvent: React.FC<oneEventProps> = ({eventList, retrieveDetails, addEventDetails}) => {
  const eventElements = eventList?.map((oneEvent, index) => {

    return (
      <div className="one-event">
        <div className='one-event-left'>
          <h3>{oneEvent.name}</h3>
          <h4>{oneEvent.location}</h4>
          <h4>{new Date(oneEvent.date).toDateString()}</h4>
          <h4>{oneEvent.isOutside ? 'Outdoor Event' : 'Indoor Event'}</h4>
          <h4>{oneEvent.organizer ? `Organizer: ${oneEvent?.organizer?.name}` : null}</h4>
          <h4>{`${oneEvent.attendees.length} people are attending`}</h4>
        </div>
        {oneEvent.isOutside ?
        <div id={`id${index}`}>
          <button className={`weather-button class${index}`} onClick={()=>retrieveDetails(oneEvent._id)}>
            Get Event Details
          </button>
        </div>
        : null}
      </div>
    )
  })

  return (
    <div className="events-container">
      {eventElements}
    </div>
  );
};

export default OneEvent;