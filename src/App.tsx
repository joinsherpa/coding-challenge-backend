import { getDefaultSettings } from 'http2';
import React , { useState } from 'react';
import FindEvents from './components/findEvents';

const App: React.FC = () => {
  const [dates, setDates] = useState([]);

  function getEvents(date1?: Date, date2?: Date): void {
    if (!date1) {
      return
    } else if (date1 && !date2) {
      return
    }
    return
  }

  return (
    <>
      <h1>Event Headquarters</h1>
      <FindEvents getEvents={getEvents}/>
    </>
  );
};

export default App;