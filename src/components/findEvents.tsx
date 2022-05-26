import React, { useState } from "react";
import Calendar from "react-calendar";
import { ProgressPlugin } from "webpack";

type FindEventProps = {
  getEvents: (date1: Date, date2?: Date, lastId?: String) => void;
};

const FindEvents: React.FC<FindEventProps> = ({ getEvents }) => {
  const [fromDate, changeFromDate] = useState<Date>();
  const [toDate, changeToDate] = useState<Date>();

  function changeDate(dateObj: Date) {
    if (!fromDate) {
      changeFromDate(dateObj);
    } else if (fromDate && !toDate) {
      changeToDate(dateObj);
    } else if (fromDate && toDate) {
      changeFromDate(dateObj);
      changeToDate(undefined);
    }
  }

  function submitDates() {
    let startDate = fromDate ? fromDate : new Date();
    getEvents(startDate, toDate);
    changeFromDate(undefined);
    changeToDate(undefined);
  }

  return (
    <>
      <Calendar
        className="calendar"
        onChange={changeDate}
        // selectRange={true}
        returnValue={"start"}
      />
      <div className="top-right-container">
        <h3 className="directions">Step 1: Choose start date (optional)</h3>
        {/* <h4>
          Selected From Date:
          <span>{fromDate?.toDateString()}</span>
        </h4> */}
        <h3 className="directions">Step 2: Choose end date (optional)</h3>
        {/* <h4>
          Selected To Date:
          <span>{toDate?.toDateString()}</span>
        </h4> */}
        <h2>Or</h2>
        <h3 className="directions">
          Just click the button below to get all current/future events
        </h3>
        <div className="search-range-container">
          {fromDate ? (
            <span className="range">
              <span className="range-tag">Date Range:</span>
              {fromDate?.toDateString()}
            </span>
          ) : null}
          {toDate ? (
            <span className="range"> to {toDate?.toDateString()}</span>
          ) : null}
        </div>

        <button onClick={submitDates}>Find Events</button>
      </div>
    </>
  );
};

export default FindEvents;
