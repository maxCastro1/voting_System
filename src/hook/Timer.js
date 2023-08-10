import { useState, useEffect } from "react";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export default function useTimer(endTime, interval = SECOND) {
  const [timespan, setTimespan] = useState(new Date(endTime) - Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimespan((_timespan) => _timespan - interval);
    }, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [endTime, interval]);

  return {
    days: Math.max(0, Math.floor(timespan / DAY)),
    hours: Math.max(0, Math.floor((timespan / HOUR) % 24)),
    minutes: Math.max(0, Math.floor((timespan / MINUTE) % 60)),
    seconds: Math.max(0, Math.floor((timespan / SECOND) % 60))
  };
}
