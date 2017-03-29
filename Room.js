import React, { Component, PropTypes } from 'react';
import { View, Text, StyleSheet, Linking, Button } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default class Room extends Component {
  static propTypes = {
    diary: PropTypes.string,
    map: PropTypes.string,
    children: PropTypes.node,
  };
  constructor(props) {
    super(props);
    this.openDiary = this.openDiary.bind(this);
    this.openMap = this.openMap.bind(this);
  }

  openDiary() {
    Linking.canOpenURL(this.props.diary).then(supported => {
      if (supported) {
        Linking.openURL(this.props.diary);
      } else {
        console.log(`Don\'t know how to open URI: ${this.props.diary}`);
      }
    });
  }
  openMap() {
    Linking.canOpenURL(this.props.map).then(supported => {
      if (supported) {
        Linking.openURL(this.props.map);
      } else {
        console.log(`Don\'t know how to open URI: ${this.props.diary}`);
      }
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <Text>{this.props.children}</Text>
        </View>
        <View style={styles.rightContainer}>
          <Button
            onPress={this.openDiary}
            title={"Diary"}
          />
          <Button
            onPress={this.openMap}
            title={"Map"}
          />
        </View>
      </View>
    );
  }
}
