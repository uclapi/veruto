const freeRooms = (state = [], action) => {
  switch (action.type) {
    case 'ROOMS_FETCHED':
      return action.rooms;
    default:
      return state;
  }
};

export default freeRooms;
