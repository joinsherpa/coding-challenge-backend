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
};

const OneEvent: React.FC<oneEventProps> = ({eventList}) => {

  const eventElements = eventList?.map((oneEvent) => {
    return (
      <div className="one-event">
        <h3>{oneEvent.name}</h3>
        <h4>{oneEvent.location}</h4>
        <h4>{new Date(oneEvent.date).toDateString()}</h4>
        <h4>{oneEvent.isOutside ? 'Outdoor Event' : 'Indoor Event'}</h4>
        <h4>{oneEvent?.organizer?.name}</h4>
        <h4>{`${oneEvent.attendees.length} people are attending`}</h4>
      </div>
    )
  })

  return (
    <div className="events-container">
    <h1>{eventElements}</h1>
    </div>
  );
};

export default OneEvent;