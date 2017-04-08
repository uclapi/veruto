import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  Picker,
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
  onNavigatorEvent(event) {
    if (event.id === 'close') {
      this.props.navigator.dismissModal();
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Picker
          selectedValue={"40"}
          // onValueChange={(lang) => this.setState({language: lang})}
        >
          <Picker.Item label={"30"} value={"30"} />
          <Picker.Item label={"45"} value={"45"} />
          <Picker.Item label={"60"} value={"60"} />
        </Picker>
      </View>
    );
  }

}
