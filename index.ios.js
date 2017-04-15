import { Navigation } from 'react-native-navigation';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { registerScreens } from './screens';
import reducer from './reducers';

const store = createStore(reducer);
registerScreens(store, Provider);

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
