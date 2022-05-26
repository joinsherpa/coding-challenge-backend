import React from "react";
import { Weather } from "../mongo";

type EventObj = {
  _id: String;
  name: String;
  isOutside: Boolean;
  location: String;
  date: Date;
  organizer: { name: String };
  attendees: [];
  weather?: Weather;
  __v: Number;
};

type oneEventProps = {
  eventList: EventObj[] | null;
  retrieveDetails: (id: String) => void;
};

const OneEvent: React.FC<oneEventProps> = ({ eventList, retrieveDetails }) => {

  const eventElements = eventList?.map((oneEvent, index) => {
    return (
      <div className="one-event">
        {"weather" in oneEvent ? (
          <div className="one-event-left">
            <h3>{oneEvent.name}</h3>
            <h4>{oneEvent.location}</h4>
            <h4>{new Date(oneEvent.date).toDateString()}</h4>
            <h4>{oneEvent.isOutside ? "Outdoor Event" : "Indoor Event"}</h4>
            <h4>
              {oneEvent.organizer
                ? `Organizer: ${oneEvent?.organizer?.name}`
                : null}
            </h4>
            <h4>{`${oneEvent.attendees.length} people are attending`}</h4>
          </div>
        ) : (
          <div className="one-event-left">
            <h3>{oneEvent.name}</h3>
            <h4>{oneEvent.location}</h4>
            <h4>{new Date(oneEvent.date).toDateString()}</h4>
            <h4>{oneEvent.isOutside ? "Outdoor Event" : "Indoor Event"}</h4>
          </div>
        )}

        {"weather" in oneEvent ? null : (
          <div id={`id${index}`}>
            <button
              className={`weather-button class${index}`}
              onClick={() => retrieveDetails(oneEvent._id)}
            >
              Get Event Details
            </button>
          </div>
        )}
        {"weather" in oneEvent && oneEvent.weather ? (
          <div className="weather">
            <h3>{`${oneEvent.weather.temperatureInDegreesCelcius}`}
            <span>&deg; C</span>
            </h3>
            <h4>{
              oneEvent.weather.chanceOfRain === 'Unknown Chance of Rain' ?
              `${oneEvent.weather.chanceOfRain}` :
            `${oneEvent.weather.chanceOfRain}% Chance of Rain`}
            </h4>
          </div>
        ) : null}
      </div>
    );
  });
  return <div className="events-container">
    {eventElements}
    </div>;
};

export default OneEvent;
