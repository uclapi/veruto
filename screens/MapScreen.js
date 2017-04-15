import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Alert,
} from 'react-native';

import MapView from 'react-native-maps';
import { connect } from 'react-redux';


const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

class MapScreen extends Component {
  static propTypes = {
    navigator: PropTypes.any,
    freeRooms: PropTypes.array.isRequired,
    userPosition: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    console.log(props.freeRooms);
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
        {this.props.freeRooms.map(room => (
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

const mapStateToProps = (state) => ({
  freeRooms: state.freeRooms,
  userPosition: state.userPosition,
});

export default connect(mapStateToProps)(MapScreen);
