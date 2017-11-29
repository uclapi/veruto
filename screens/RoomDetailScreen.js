import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';

import { connect } from 'react-redux';
import Moment from 'moment';
import { API_DOMAIN, API_KEY } from 'react-native-dotenv';
import Table from 'react-native-simple-table';


const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    // height: '100%',
  },
  loading: {
    marginTop: 20,
  },
  table: {
    width: '100%',
  },
  diaryHeader: {
    fontWeight: 'bold',
  },
  map: {
    height: 200,
    width: '100%',
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

class RoomDetailScreen extends Component {
  static propTypes = {
    navigator: PropTypes.object,
    freeRooms: PropTypes.array.isRequired,
    userPosition: PropTypes.object.isRequired,
    room: PropTypes.object.isRequired,
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
      diary(roomid: "${this.props.room.roomid}", siteid: "${this.props.room.siteid}", date: "${date}") {
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
    fetch(`${API_DOMAIN}`, {
      method: 'POST',
      body: JSON.stringify({ query }),
      headers: new Headers({
        'Content-Type': 'application/graphql',
        'x-api-key': API_KEY,
      }),
    })
    .then(response => response.json())
    .then(json => {
      const bookings = json.diary.bookings;
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
              style={styles.loading}
              size={"large"}
            />
          </When>
          <When condition={this.state.bookings.length === 0 && this.state.loading === false}>
            <Text>
              {'No bookings in this room today.'}
            </Text>
          </When>
          <Otherwise>
            <View style={styles.table}>
              <Table
                columns={columns}
                dataSource={this.state.cleanedBookings}
              />
            </View>
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

export default connect(mapStateToProps)(RoomDetailScreen);
