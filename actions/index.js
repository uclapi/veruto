export const updateRooms = (rooms) => ({
  type: 'ROOMS_FETCHED',
  rooms,
});

export const updateUserPosition = (position) => ({
  type: 'USER_POSITION_UPDATED',
  position,
});

export const updateSettingsMinutesFuture = (minutesFuture) => ({
  type: 'MINUTES_FUTURE_SETTING_UPDATED',
  minutesFuture,
});
