import dayjs from 'dayjs';
import { SortType } from '../consts';

const pointDayCompare = (firstPoint, secondPoint) => dayjs(firstPoint.dateFrom).diff(dayjs(secondPoint.dateFrom));

const pointPriceCompare = (firstPoint, secondPoint) => secondPoint.basePrice - firstPoint.basePrice;

const pointTimeCompare = (firstPoint, secondPoint) => {
  const timePointA = dayjs(firstPoint.dateTo).diff(dayjs(firstPoint.dateFrom));
  const timePointB = dayjs(secondPoint.dateTo).diff(dayjs(secondPoint.dateFrom));
  return timePointB - timePointA;
};

const SortComparers = {
  [SortType.DAY]: pointDayCompare,
  [SortType.PRICE]: pointPriceCompare,
  [SortType.TIME]: pointTimeCompare
};

export { SortComparers };
