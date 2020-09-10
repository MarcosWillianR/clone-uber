import React, { useEffect, useState, useCallback, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { View, Image } from 'react-native';
import Geocoder from 'react-native-geocoding';

import { getPixelSize } from '../../utils';

import Search from '../Search';
import Directions from '../Directions';
import Details from '../Details';

import uberMarker from '../../assets/marker.png';
import backImage from '../../assets/back.png';

import { 
  LocationBox,
  LocationTimeBox,
  LocationText,
  LocationTimeText,
  LocationTimeTextSmall,
  Back,
} from './styles';

export default function Map() {
  const [region, setRegion] = useState(null);
  const [location, setLocation] = useState('');
  const [destination, setDestination] = useState(null);
  const [duration, setDuration] = useState(null);
  const mapView = useRef(null);

  useEffect(() => {
    Geocoder.init("AIzaSyDeOaNzT9DSzJPTdt4dpGM5L4rs2ZIut5I");

    Geolocation.getCurrentPosition(async ({ coords }) => {
      const { latitude, longitude } = coords;
      const response = await Geocoder.from({ latitude, longitude });
      const address = response.results[0].formatted_address;
      const formattedLocation = address.substring(0, address.indexOf(','));

      setLocation(formattedLocation);

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0143,
        longitudeDelta: 0.0134,
      });
    }, () => {}, {
      timeout: 2000,
      enableHighAccuracy: true,
      maximumAge: 1000,
    });
  }, []);

  const handleLocationSelected = useCallback((data, details) => {
    const { geometry } = details;
    const { location: { lat: latitude, lng: longitude } } = geometry;

    setDestination({
      latitude,
      longitude,
      title: data.structured_formatting.main_text,
    });
  }, []);

  const handleBack = useCallback(() => {
    setDestination(null);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{flex: 1}}
        region={region}
        showsUserLocation
        loadingEnabled
        ref={mapView}
      >
        {destination && (
          <>
            <Directions
              origin={region}
              destination={destination}
              onReady={result => {
                setDuration(Math.floor(result.duration))

                mapView.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: getPixelSize(50),
                    left: getPixelSize(50),
                    top: getPixelSize(50),
                    bottom: getPixelSize(350),
                  }
                });
              }}
            />
            <Marker
              coordinate={destination}
              anchor={{ x: 0, y: 0 }}
              image={uberMarker}
            >
              <LocationBox>
                <LocationText>{destination.title}</LocationText>
              </LocationBox>
            </Marker>

            <Marker
              coordinate={region}
              anchor={{ x: 0, y: 0 }}
            >
              <LocationBox>
                <LocationTimeBox>
                  <LocationTimeText>{duration}</LocationTimeText>
                  <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                </LocationTimeBox>
                <LocationText>{location}</LocationText>
              </LocationBox>
            </Marker>
          </>
        )}
      </MapView>

      {destination ? (
        <>
          <Back onPress={handleBack}>
            <Image source={backImage} />
          </Back>
          <Details />
        </>
      ) : (
        <Search onLocationSelected={handleLocationSelected} />
      )}

    </View>
  )
}