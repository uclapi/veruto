import React, { Component, PropTypes } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Moment from 'moment';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default class DiaryItem extends Component {
  static propTypes = {
    start: PropTypes.string,
    end: PropTypes.string,
    description: PropTypes.string,
    contact: PropTypes.string,
  };
  constructor(props) {
    // Something here or stateless component
    super(props);
  }

  render() {
    const start = new Moment(this.props.start);
    const end = new Moment(this.props.end);
    return (
      <View style={styles.container}>
        <Text>{`${start.format('HH:mm')} - ${end.format('HH:mm')}`}</Text>
        <Text>{`${this.props.description}`}</Text>
        <Text>{`${this.props.contact}`}</Text>
      </View>
    );
  }
}
