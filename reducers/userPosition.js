const userPosition = (state = {}, action) => {
  switch (action.type) {
    case 'USER_POSITION_UPDATED':
      return {
        position: action.position,
        long: action.position.coords.longitude,
        lat: action.position.coords.latitude,
      };
    default:
      return state;
  }
};

export default userPosition;
