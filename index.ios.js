import React, { Component } from 'react';
import {
 AppRegistry,
 StyleSheet,
 View,
 ListView,
 RefreshControl,
} from 'react-native';
import Moment from 'moment';

import Header from './Header';
import Room from './Room';

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);  // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
   Math.sin(dLat / 2) * Math.sin(dLat / 2) +
   Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
   Math.sin(dLon / 2) * Math.sin(dLon / 2)
   ;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    alignSelf: 'stretch',
  },
});


export default class veruto extends Component {

  constructor(props) {
    super(props);
    this.updateLocation = this.updateLocation.bind(this);
    this.onRefresh = this.onRefresh.bind(this);

    this.state = {
      long: 'unknown',
      lat: 'unknown',
      position: 'unknown',
      dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
      refreshing: false,
      initialLoad: true,
    };
  }

  componentDidMount() {
    this.updateLocation();
  }

  onRefresh() {
    this.setState({ refreshing: true });
    this.updateLocation();
    this.setState({ refreshing: false });
  }

  updateLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        fetch('https://ucl-free.herokuapp.com/allRooms')
        .then(response => response.json())
        .then(json => {
          console.log(json);

          const allRooms = json;
          const currentTime = new Moment(new Date());
          const endTime = new Moment(new Date()).add(30, 'minutes');
          const freeRooms = [];

          for (let i = 0; i < allRooms.length; i++) {
            const bookings = allRooms[i].diary;
            let roomIsFree = true;
            for (let k = 0; k < bookings.length; k++) {
              const bookingStart = new Moment(bookings[k].booking_start, 'hh:mm');
              const bookingEnd = new Moment(bookings[k].booking_end, 'hh:mm');
              if ((currentTime < bookingEnd && endTime > bookingStart)) {
                roomIsFree = false;
                break;
              }
            }
            if (roomIsFree) {
              freeRooms.push(allRooms[i]);
            }
          }
          freeRooms.sort((a, b) => {
            const distance1 = getDistanceFromLatLonInKm(
              position.coords.latitude,
              position.coords.longitude,
              a.latlng[0], a.latlng[1]
            );
            const distance2 = getDistanceFromLatLonInKm(
              position.coords.latitude,
              position.coords.longitude,
              b.latlng[0], b.latlng[1]
            );
            if (distance1 > distance2) {
              return 1;
            }

            return -1;
          });
          console.log(freeRooms);

          this.setState({
            long: position.coords.longitude,
            lat: position.coords.latitude,
            position,
            buttonActive: false,
            dataSource: this.state.dataSource.cloneWithRows(freeRooms),
          });
        })
       .catch(error => console.log(error));
      },
     (error) => alert(JSON.stringify(error)),
     { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(room) => <Room diary={room.diary_link} map={`http://maps.apple.com/?ll=<${room.latlng[0]}>,<${room.latlng[1]}>`}>{room.name}</Room>}
          initialListSize={100}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
          renderHeader={() => <Header />}
        />
      </View>
    );
  }
}

AppRegistry.registerComponent('veruto', () => veruto);
