// TODO: add format parameter for custom formatting.
export function formatDate(date) {
  return getMonthRaw(date) + '/' + getDayRaw(date) + '/' + getYearRaw(date);
}

export function getYearRaw(date) {
  return date.getFullYear();
}

export function getMonthRaw(date, short?) {
  if (short) {
    return date.getMonth();
  } else {
    return ('0' + (date.getMonth() + 1)).slice(-2);
  }
}

export function getDayRaw(date, short?) {
  if (short) {
    return date.getDate();
  } else {
    return ('0' + date.getDate()).slice(-2);
  }
}

/**
 * set additional api filters
 */
export function getCalculatedDateByDay(day?) {
  const date = new Date();
  if (day) {
    date.setDate(date.getDate() + day);
  }

  return formatDate(date);
}

/**
 * set additional api filters
 */
export function getCalculatedDateByMonth(month) {
  const date = new Date();
  date.setMonth(date.getMonth() + month);

  return formatDate(date);
}

export function getMonthFormatted(date, short?) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const monthNamesShort = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const monthIndex = date.getMonth();

  if (short) {
    return monthNamesShort[monthIndex];
  } else {
    return monthNames[monthIndex];
  }
}

// TODO: make this function to take format as parameter and merge with others.
export function getFormattedDateSimple(rawDate) {
  const dateObj = new Date(rawDate);

  return getMonthRaw(dateObj) +
    getDayRaw(dateObj) +
    getYearRaw(dateObj);
}

export function getFormattedDate(rawDate) {
  const dateObj = new Date(rawDate.replace(/-/g, '\/'));
  let date = getMonthFormatted(dateObj);
  date += ' ' + getDayRaw(dateObj, true);
  date += ', ' + getYearRaw(dateObj);

  return date;
}

export function getFormattedDateWithDay(rawDate) {
  const weekday = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
    ];
  const dateObj = new Date(rawDate.replace(/-/g, '\/'));
  const currentDay = weekday[dateObj.getDay()];
  let date = getMonthFormatted(dateObj);
  date += ' ' + getDayRaw(dateObj, true);
  date += ', ' + getYearRaw(dateObj);
  return `${currentDay}, ${date}`;
}
