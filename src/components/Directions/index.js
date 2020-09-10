import React from 'react';
import MapViewDirections from 'react-native-maps-directions';

export default function Directions({ destination, origin, onReady }) {
  return (
    <MapViewDirections 
      destination={destination}
      origin={origin}
      onReady={onReady}
      apikey="AIzaSyDeOaNzT9DSzJPTdt4dpGM5L4rs2ZIut5I"
      strokeWidth={3}
      strokeColor="#222"
    />
  );
}