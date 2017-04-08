import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Alert,
} from 'react-native';
// import { Navigation } from 'react-native-navigation';

import MapView from 'react-native-maps';

import { getDistanceFromLatLonInKm } from './HomeScreen/helpers';

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default class MapScreen extends Component {
  static propTypes = {
    navigator: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.updateLocation = this.updateLocation.bind(this);
    // if you want to listen on navigator events, set this up
    // this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this.state = {
      long: 'unknown',
      lat: 'unknown',
      position: 'unknown',
      rooms: [
        {
          location: {
            coordinates: {
              lat: 0.0,
              lng: 0.0,
            },
          },
        },
      ],
    };
  }

  componentDidMount() {
    this.updateLocation();
  }

  updateLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetch('http://localhost:5000/api/rooms.free')
        .then(response => response.json())
        .then(json => {
          const freeRooms = json.rooms;

          freeRooms.sort((a, b) => {
            const distance1 = getDistanceFromLatLonInKm(
              position.coords.latitude,
              position.coords.longitude,
              a.location.coordinates.lat, a.location.coordinates.lng
            );
            const distance2 = getDistanceFromLatLonInKm(
              position.coords.latitude,
              position.coords.longitude,
              b.location.coordinates.lat, b.location.coordinates.lng
            );
            if (distance1 > distance2) {
              return 1;
            }
            return -1;
          });

          this.setState({
            long: position.coords.longitude,
            lat: position.coords.latitude,
            position,
            rooms: freeRooms,
          });
        })
       .catch(error => console.log(error));
      },
     (error) => Alert.alert(JSON.stringify(error)),
     { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  render() {
    return (
      <MapView
        initialRegion={{
          latitude: 51.5245625,
          longitude: -0.1362288,
          latitudeDelta: 0.00922,
          longitudeDelta: 0.00421,
        }}
        style={styles.map}
      >
        {this.state.rooms.map(room => (
          <MapView.Marker
            key={`${room.siteid}--${room.roomid}--${room.classification}`}
            coordinate={{
              latitude: parseFloat(room.location.coordinates.lat),
              longitude: parseFloat(room.location.coordinates.lng),
            }}
            title={room.roomname}
            showsUserLocation
            showsMyLocationButton
            showsCompass={false}
            // description={marker.description}
          />
        ))}
      </MapView>
    );
  }
}
