import React, { useState, useRef } from 'react';
import Calendar from 'react-calendar';
import { ProgressPlugin } from 'webpack';

type FindEventProps = {
  getEvents: (date1?: Date, date2?: Date) => void
};

const FindEvents: React.FC<FindEventProps> = (props) => {
  const [fromDate, changeFromDate] = useState<Date>();
  const [toDate, changeToDate] = useState<Date>();
  const fromRef = useRef<HTMLSpanElement>(null);
  const toRef = useRef<HTMLSpanElement>(null);

  function changeDate(dateObj: Date) {
    if (!fromDate) {
      changeFromDate(dateObj)
    } else if (fromDate && !toDate) {
      changeToDate(dateObj)
    } else if (fromDate && toDate) {
      changeFromDate(dateObj)
      changeToDate(undefined)
    }
  }

  function submitDates() {
    props.getEvents(fromDate, toDate)
    changeFromDate(undefined);
    changeToDate(undefined);
  }

  return (
    <>
      <Calendar
        onChange={changeDate}
        // selectRange={true}
        returnValue={"start"}
      />

        <h3>Step 1: Choose start date (optional)</h3>
        <h4>
          Selected From Date:
          <span ref={fromRef}>{fromDate?.toDateString()}</span>
        </h4>
        <h3>Step 2: Choose start date (optional)</h3>
        <h4>
          Selected To Date:
          <span ref={toRef}>{toDate?.toDateString()}</span>
          </h4>
        <h2>Or</h2>
        <h3>Just click the button below to get all current/future events</h3>
      <button  onClick={submitDates}>Find Events</button>
    </>
  );
};

export default FindEvents;