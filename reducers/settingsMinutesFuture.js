const settingsMinutesFuture = (state = '30', action) => {
  switch (action.type) {
    case 'MINUTES_FUTURE_SETTING_UPDATED':
      return action.minutesFuture;
    default:
      return state;
  }
};

export default settingsMinutesFuture;
