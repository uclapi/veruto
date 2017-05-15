import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  Picker,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import { updateSettingsMinutesFuture } from '../actions';

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

class ModalSettingsScreen extends Component {
  static propTypes = {
    navigator: PropTypes.any,
    settingsMinutesFuture: PropTypes.string.isRequired,
    updateSettingsMinutesFuture: PropTypes.func.isRequired,
  };

  static navigatorButtons = {
    rightButtons: [{
      title: 'Close',
      id: 'close',
    }],
  };

  constructor(props) {
    super(props);
    // if you want to listen on navigator events, set this up
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    console.log(props.settingsMinutesFuture);
  }


  onNavigatorEvent(event) {
    if (event.id === 'close') {
      this.props.navigator.dismissModal();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{"All displayed rooms should be free for the next"}</Text>
        <Picker
          selectedValue={this.props.settingsMinutesFuture}
          onValueChange={this.props.updateSettingsMinutesFuture}
        >
          <Picker.Item label={"30 minutes"} value={"30"} />
          <Picker.Item label={"45 minutes"} value={"45"} />
          <Picker.Item label={"60 minutes"} value={"60"} />
        </Picker>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  settingsMinutesFuture: state.settingsMinutesFuture,
});

const mapDispatchToProps = {
  updateSettingsMinutesFuture,
};
export default connect(mapStateToProps, mapDispatchToProps)(ModalSettingsScreen);
