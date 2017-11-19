import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  ListView,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';

import Room from './HomeScreen/Room';
import { sortRooms } from './HomeScreen/helpers';
import { updateRooms, updateUserPosition } from '../actions';
import { API_DOMAIN, API_KEY } from 'react-native-dotenv';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    alignSelf: 'stretch',
  },
});

class HomeScreen extends Component {
  static propTypes = {
    navigator: PropTypes.any,
    freeRooms: PropTypes.array.isRequired,
    updateRooms: PropTypes.func.isRequired,
    userPosition: PropTypes.object.isRequired,
    updateUserPosition: PropTypes.func.isRequired,
    settingsMinutesFuture: PropTypes.string.isRequired,
  };

  static navigatorButtons = {
    rightButtons: [
      {
        title: 'Settings',
        id: 'settings',
      },
    ],
  };

  constructor(props) {
    super(props);
    this.updateLocation = this.updateLocation.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
      refreshing: false,
      initialLoad: true,
      minutesFuture: 30,
    };
  }

  componentDidMount() {
    this.updateLocation();
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'settings':
        this.props.navigator.showModal({
          title: 'Settings',
          screen: 'veruto.ModalSettingsScreen',
        });
        break;
      case 'didAppear':
        break;
      default:
        return;
    }
  }

  updateLocation() {
    this.setState({ refreshing: true });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const query = `
          {
            freeRooms(minutes: ${this.props.settingsMinutesFuture}){
              roomid
              roomname
              siteid
              classification
              bookings {
                contact
                description
                startTime
                endTime
                slotid
                weeknumber
                phone
              }
              location {
                coordinates {
                  lat
                  lng
                }
              }
            }
          }`;
        fetch(API_DOMAIN, {
          method: 'POST',
          body: JSON.stringify({ query }),
          headers: new Headers({
            'Content-Type': 'application/graphql',
            'x-api-key': API_KEY,
          }),
        })
        .then(response => response.json())
        .then(json => {
          const freeRooms = json.freeRooms;
          const rooms = sortRooms(freeRooms, position);

          this.setState({
            buttonActive: false,
            dataSource: this.state.dataSource.cloneWithRows(rooms),
            refreshing: false,
          });
          this.props.updateRooms(rooms);
          this.props.updateUserPosition(position);
        })
       .catch(error => console.log(error));
      },
     (error) => Alert.alert(JSON.stringify(error)),
     { enableHighAccuracy: false, timeout: 20000, maximumAge: (2 * 60 * 60 * 1000) }
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(room) =>
            <Room
              diary={`https://roombooking.ucl.ac.uk/rb/bookableSpace/roomDiary.html?room=${room.roomid}&building=${room.siteid}&invoker=EFD`}
              map={
                (Platform.OS === 'ios') ?
                `http://maps.apple.com/?daddr=${room.location.coordinates.lat},${room.location.coordinates.lng}` :
                `http://maps.google.com/maps?daddr=${room.location.coordinates.lat},${room.location.coordinates.lng}`
              }
              distance={room.distance}
              name={room.roomname}
              navigator={this.props.navigator}
              room={room}
            />}
          initialListSize={100}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.updateLocation}
            />
          }
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  freeRooms: state.freeRooms,
  userPosition: state.userPosition,
  settingsMinutesFuture: state.settingsMinutesFuture,
});

const mapDispatchToProps = {
  updateRooms,
  updateUserPosition,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
