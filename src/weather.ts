import axios from 'axios';
const { weatherKey } = require('../config.js');

export type GoogleGeocodingResponse = {
  results: {geometry: {location: {lat: number, lng: number}}}[];
  status: 'OK' | 'ZERO_RESULTS';
};

export function getWeather(lat: Number, lon: Number) {
  return axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${weatherKey}`
  )
}