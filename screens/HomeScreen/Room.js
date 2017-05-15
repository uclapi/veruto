import React, { Component, PropTypes } from 'react';
import { View, Text, StyleSheet, Linking, Button, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    flexDirection: 'row',
    paddingBottom: 0,
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  columnContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 0,
  },
  roomnameContainer: {
  },
  freeUntil: {
    fontSize: 10,
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
      screen: 'veruto.DiaryScreen',
      passProps: {
        siteid: this.props.room.siteid,
        roomid: this.props.room.roomid,
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
      <View style={styles.container}>
        <TouchableOpacity style={styles.leftContainer} onPress={this.openDiary}>
          <Text>{`${this.props.distance}m`}</Text>
          <Text>{" "}</Text>
          <Text>{this.props.name}</Text>
        </TouchableOpacity>
        <View style={styles.rightContainer}>
          <Button
            onPress={this.openMap}
            title={"Directions"}
          />
        </View>
      </View>
    );
  }
}
