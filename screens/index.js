import { Navigation } from 'react-native-navigation';

import ModalSettingsScreen from './ModalSettingsScreen';
import HomeScreen from './HomeScreen';
import MapScreen from './MapScreen';


// register all screens of the app (including internal ones)
export function registerScreens() {
  Navigation.registerComponent('veruto.ModalSettingsScreen', () => ModalSettingsScreen);
  Navigation.registerComponent('veruto.HomeScreen', () => HomeScreen);
  Navigation.registerComponent('veruto.MapScreen', () => MapScreen);
}
