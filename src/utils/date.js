import dayjs from 'dayjs';

const MINUTES_PER_HOUR_COUNT = 60;
const MINUTES_PER_DAY_COUNT = 1440;
const TIME_FORMAT = 'HH:mm';
const DATE_FORMAT = 'YYYY-MM-DD';
const DATETIME_FORMAT = 'DD/MM/YY hh:mm';

const humanizePointDueDate = (date) => dayjs(date).format('DD MMM');

const duration = (dateFrom, dateTo) => {
  const start = dayjs(dateFrom);
  const end = dayjs(dateTo);
  const difference = end.diff(start, 'minute');

  const days = Math.floor(difference / MINUTES_PER_DAY_COUNT);
  const restHours = Math.floor((difference - days * MINUTES_PER_DAY_COUNT) / MINUTES_PER_HOUR_COUNT);
  const restMinutes = difference - (days * MINUTES_PER_DAY_COUNT + restHours * MINUTES_PER_HOUR_COUNT);

  const daysOutput = (days) ? `${days}D `.padStart(4, '0') : '';
  const hoursOutput = (days || restHours) ? `${restHours}H `.padStart(4, '0') : '';
  const minutesOutput = (days || restMinutes) ? `${restMinutes}M`.padStart(3, '0') : '';

  return `${daysOutput}${hoursOutput}${minutesOutput}`;
};

const getDate = (date) => dayjs(date).format(DATE_FORMAT);

const getTime = (date) => dayjs(date).format(TIME_FORMAT);

const getDateTime = (date) => dayjs(date).format(DATETIME_FORMAT);

const isPointDateInProgress = (dateFrom, dateTo) => dayjs().diff(dateFrom, 'minute') > 0 && dayjs().diff(dateTo, 'minute') < 0;

const isPointDateInPast = (dateTo) => dayjs().diff(dateTo, 'minute') > 0;

const isPointDateInFuture = (dateFrom) => dayjs().diff(dateFrom, 'minute') <= 0;

export { humanizePointDueDate, duration, getDate, getDateTime, getTime, isPointDateInPast, isPointDateInFuture, isPointDateInProgress };
