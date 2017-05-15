import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';

import { connect } from 'react-redux';
import Moment from 'moment';
import { API_DOMAIN } from 'react-native-dotenv';
import Table from 'react-native-simple-table';


const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: '#F5FCFF',
    justifyContent: 'center',
    flexDirection: 'row',
    height: '100%',
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
});

const columns = [
  {
    title: 'Start',
    dataIndex: 'cleanStart',
    width: 50,
  },
  {
    title: 'End',
    dataIndex: 'cleanEnd',
    width: 50,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    width: 150,
  },
  {
    title: 'Contact',
    dataIndex: 'contact',
    width: 110,
  },
];

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

    this.state = {
      bookings: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchDiary();
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
      const cleanedBookings = bookings.map((booking) => {
        const start = new Moment(booking.startTime);
        const end = new Moment(booking.endTime);
        return {
          ...booking,
          cleanStart: start.format('HH:mm'),
          cleanEnd: end.format('HH:mm'),
        };
      });

      this.setState({
        bookings,
        cleanedBookings,
        loading: false,
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Choose>
          <When condition={this.state.loading === true}>
            <ActivityIndicator
              animating={this.state.loading}
              style={[styles.centering, { height: 80 }]}
              size={"large"}
            />
          </When>
          <When condition={this.state.bookings.length === 0 && this.state.loading === false}>
            <Text>
              {'No bookings in this room today.'}
            </Text>
          </When>
          <Otherwise>
            <Table
              columns={columns}
              dataSource={this.state.cleanedBookings}
            />
          </Otherwise>
        </Choose>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  freeRooms: state.freeRooms,
  userPosition: state.userPosition,
});

export default connect(mapStateToProps)(DiaryScreen);
