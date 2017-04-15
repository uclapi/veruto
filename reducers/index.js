import { combineReducers } from 'redux';

import freeRooms from './freeRooms';
import userPosition from './userPosition';

const rootReducer = combineReducers({
  freeRooms,
  userPosition,
});

export default rootReducer;
