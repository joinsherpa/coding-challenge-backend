import axios from 'axios';
const { geoCodeKey } = require('../config.js');

export type GoogleGeocodingResponse = {
  results: {geometry: {location: {lat: number, lng: number}}}[];
  status: 'OK' | 'ZERO_RESULTS';
};

export function searchAddressHandler(location: string) {
  const locWithSpaces = location.replaceAll('|', ' ');
  // send address to google geocoding api
  return axios.get<GoogleGeocodingResponse>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(locWithSpaces)}&key=${geoCodeKey}`
  )

}
