import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  RefreshControl,
  View,
  ListView,
} from 'react-native';

import { connect } from 'react-redux';
import Moment from 'moment';
import { API_DOMAIN } from 'react-native-dotenv';

import DiaryItem from './DiaryScreen/DiaryItem';


const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: '#F5FCFF',
    justifyContent: 'space-around',
    flexDirection: 'row',
    height: '100%',
  },
});

class DiaryScreen extends Component {
  static propTypes = {
    navigator: PropTypes.object,
    freeRooms: PropTypes.array.isRequired,
    userPosition: PropTypes.object.isRequired,
    siteid: PropTypes.string.isRequired,
    roomid: PropTypes.string.isRequired,
  };
  constructor(props) {
    super(props);
    this.fetchDiary = this.fetchDiary.bind(this);
    this.onRefresh = this.onRefresh.bind(this);

    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
      bookings: [],
      refreshing: false,
    };
  }

  componentDidMount() {
    this.fetchDiary();
  }

  onRefresh() {
    this.setState({ refreshing: true });
    this.fetchDiary();
    this.setState({ refreshing: false });
  }

  fetchDiary() {
    const today = new Moment();
    const date = today.format('YYYY-MM-DD');
    console.log(date);
    const query = `{
      diary(roomid: "${this.props.roomid}", siteid: "${this.props.siteid}", date: "${date}") {
        bookings {
          contact
          description
          startTime
          endTime
          slotid
          weeknumber
          phone
        }
      }
    }`;
    fetch(`${API_DOMAIN}/api/graphql`, {
      method: 'POST',
      body: query,
      headers: new Headers({
        'Content-Type': 'application/graphql',
      }),
    })
    .then(response => response.json())
    .then(json => {
      console.log(json);
      const bookings = json.data.diary.bookings;

      this.setState({
        bookings,
        dataSource: this.state.dataSource.cloneWithRows(bookings),
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(booking) =>
            <DiaryItem
              start={booking.startTime}
              end={booking.endTime}
              description={booking.description}
              contact={booking.contact}
            />}
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

const mapStateToProps = (state) => ({
  freeRooms: state.freeRooms,
  userPosition: state.userPosition,
});

export default connect(mapStateToProps)(DiaryScreen);