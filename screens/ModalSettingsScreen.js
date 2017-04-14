import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  Picker,
  AsyncStorage,
  Alert,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  button: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 10,
    marginTop: 10,
    color: 'blue',
  },
});

const MINUTES_FUTURE_KEY = '@Settings:minutes';

export default class ModalSettingsScreen extends Component {
  static propTypes = {
    navigator: PropTypes.any,
  };

  static navigatorButtons = {
    leftButtons: [{
      title: 'Close',
      id: 'close',
    }],
  };

  constructor(props) {
    super(props);
    // if you want to listen on navigator events, set this up
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }
  state = {
    minutes: 30,
  }

  componentDidMount() {
    this.loadInitialState().done();
  }

  onNavigatorEvent(event) {
    if (event.id === 'close') {
      this.props.navigator.dismissModal();
    }
  }

  onValueChange = async (selectedValue) => {
    this.setState({ minutes: parseInt(selectedValue, 10) });
    try {
      await AsyncStorage.setItem(MINUTES_FUTURE_KEY, selectedValue);
      console.log(`Saved selection to disk: ${selectedValue}`);
    } catch (error) {
      Alert.alert(`AsyncStorage error: ${error.message}`);
    }
  };

  loadInitialState = async () => {
    try {
      const value = await AsyncStorage.getItem(MINUTES_FUTURE_KEY);
      if (value !== null) {
        this.setState({ minutes: value });
        console.log(`Recovered selection from disk: ${value}`);
      } else {
        console.log('Initialized with no selection on disk.');
      }
    } catch (error) {
      Alert.alert(`AsyncStorage error: ${error.message}`);
    }
  };


  render() {
    return (
      <View style={styles.container}>
        <Picker
          selectedValue={this.state.minutes.toString()}
          onValueChange={this.onValueChange}
        >
          <Picker.Item label={"30"} value={"30"} />
          <Picker.Item label={"45"} value={"45"} />
          <Picker.Item label={"60"} value={"60"} />
        </Picker>
      </View>
    );
  }

}
