import { Navigation } from 'react-native-navigation';
import { compose, applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import { AsyncStorage } from 'react-native';

import { registerScreens } from './screens';
import reducer from './reducers';

const store = createStore(
  reducer,
  undefined,
  compose(
    applyMiddleware(),
    autoRehydrate()
  )
);

persistStore(store, { storage: AsyncStorage });
registerScreens(store, Provider);

const createTabs = () => {
  const tabs = [
    {
      screen: 'veruto.HomeScreen',
      icon: require('./images/home.png'),
      selectedIcon: require('./images/home_selected.png'),
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
