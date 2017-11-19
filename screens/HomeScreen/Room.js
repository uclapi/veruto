import React, { Component, PropTypes } from 'react';
import { View, Text, StyleSheet, Linking, Button, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    alignItems: 'center',
  },
  roomName: {
    marginLeft: 5,
    flexGrow: 2,
    // textAlign: 'right',
    // alignSelf: 'center',
  },
});

export default class Room extends Component {
  static propTypes = {
    diary: PropTypes.string,
    map: PropTypes.string,
    name: PropTypes.string,
    distance: PropTypes.number,
    navigator: PropTypes.object,
    room: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.openDiary = this.openDiary.bind(this);
    this.openMap = this.openMap.bind(this);
  }

  openDiary() {
    this.props.navigator.push({
      title: `${this.props.name} Diary`,
      screen: 'veruto.RoomDetailScreen',
      passProps: {
        room: this.props.room,
      },
    });
  }
  openMap() {
    Linking.canOpenURL(this.props.map).then(supported => {
      if (supported) {
        Linking.openURL(this.props.map);
      } else {
        console.log(`Don\'t know how to open URI: ${this.props.map}`);
      }
    });
  }
  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={this.openDiary}>
        <Text>{`${this.props.distance}m`}</Text>
        <Text style={styles.roomName}>{this.props.name}</Text>
      </TouchableOpacity>
    );
  }
}
