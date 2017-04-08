import { Navigation } from 'react-native-navigation';

import { registerScreens } from './screens';
registerScreens(); // this is where you register all of your app's screens

const createTabs = () => {
  const tabs = [
    {
      screen: 'veruto.HomeScreen',
      icon: require('./images/one.png'),
      selectedIcon: require('./images/one_selected.png'),
      title: 'Closest Rooms',
    },
    {
      screen: 'veruto.MapScreen',
      icon: require('./images/three.png'),
      selectedIcon: require('./images/three_selected.png'),
      title: 'Closest Rooms',
      navigatorStyle: {
        tabBarBackgroundColor: '#4dbce9',
      },
    },
  ];
  return tabs;
};

Navigation.startTabBasedApp({
  tabs: createTabs(),
  appStyle: {
    tabBarBackgroundColor: '#0f2362',
    tabBarButtonColor: '#ffffff',
    tabBarSelectedButtonColor: '#63d7cc',
  },
});

// Navigation.startSingleScreenApp({
//   screen: {
//     screen: 'veruto.HomeScreen',
//     title: 'Closest Rooms',
//     navigatorStyle: {
//       navBarBackgroundColor: '#4dbce9',
//       navBarTextColor: '#ffff00',
//       navBarSubtitleTextColor: '#ff0000',
//       navBarButtonColor: '#ffffff',
//       statusBarTextColorScheme: 'light',
//     },
//   },
// });
