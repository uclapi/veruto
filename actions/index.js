export const updateRooms = (rooms) => ({
  type: 'ROOMS_FETCHED',
  rooms,
});

export const updateUserPosition = (position) => ({
  type: 'USER_POSITION_UPDATED',
  position,
});
