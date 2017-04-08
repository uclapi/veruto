import React, { Component, PropTypes } from 'react';
import {
 // AppRegistry,
 StyleSheet,
 View,
 ListView,
 RefreshControl,
} from 'react-native';

// import Header from './HomeScreen/Header';
import Room from './HomeScreen/Room';

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


export default class HomeScreen extends Component {
  static propTypes = {
    navigator: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.updateLocation = this.updateLocation.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    // this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

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
        fetch('http://localhost:5000/api/rooms.free')
        .then(response => response.json())
        .then(json => {
          const freeRooms = json.rooms;
          const rooms = freeRooms.map((room) => {
            const distance = getDistanceFromLatLonInKm(
              position.coords.latitude,
              position.coords.longitude,
              room.location.coordinates.lat,
              room.location.coordinates.lng,
            );
            const finalRoom = room;
            finalRoom.distance = distance.toPrecision(3) * 1000;
            return finalRoom;
          });

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
            buttonActive: false,
            dataSource: this.state.dataSource.cloneWithRows(rooms),
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
          renderRow={(room) => <Room diary={`https://roombooking.ucl.ac.uk/rb/bookableSpace/roomDiary.html?room=${room.roomid}&building=${room.siteid}&invoker=EFD`} map={`http://maps.apple.com/?ll=<${room.location.coordinates.lat}>,<${room.location.coordinates.lng}>`} distance={room.distance}>{room.roomname}</Room>}
          initialListSize={100}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        />
      </View>
    );
  }
}

// AppRegistry.registerComponent('veruto', () => veruto);
