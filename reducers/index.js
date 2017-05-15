import { combineReducers } from 'redux';

import freeRooms from './freeRooms';
import userPosition from './userPosition';
import settingsMinutesFuture from './settingsMinutesFuture';

const rootReducer = combineReducers({
  freeRooms,
  userPosition,
  settingsMinutesFuture,
});

export default rootReducer;
