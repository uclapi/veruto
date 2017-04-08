import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingBottom: 5,
    backgroundColor: '#C1C1C1',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

const Header = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Closest Rooms</Text>
  </View>
);

export default Header;
