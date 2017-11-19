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

Navigation.startSingleScreenApp({
  screen: {
    screen: 'veruto.HomeScreen',
    title: 'Closest Rooms',
  },
});
