import { Navigation } from 'react-native-navigation';

import ModalSettingsScreen from './ModalSettingsScreen';
import HomeScreen from './HomeScreen';
import MapScreen from './MapScreen';
import DiaryScreen from './DiaryScreen';


// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
  Navigation.registerComponent(
      'veruto.ModalSettingsScreen',
      () => ModalSettingsScreen,
      store,
      Provider
  );
  Navigation.registerComponent('veruto.HomeScreen', () => HomeScreen, store, Provider);
  Navigation.registerComponent('veruto.MapScreen', () => MapScreen, store, Provider);
  Navigation.registerComponent('veruto.DiaryScreen', () => DiaryScreen, store, Provider);
}
