import dayjs from "dayjs";
import { SortType } from "../const";

const pointDayComparer = (firstPoint, secondPoint) => dayjs(firstPoint.dateFrom).diff(dayjs(secondPoint.dateFrom));

const pointPriceComparer = (firstPoint, secondPoint) => secondPoint.basePrice - firstPoint.basePrice;

const pointTimeComparer = (firstPoint, secondPoint) => {
  const timePointA = dayjs(firstPoint.dateTo).diff(dayjs(firstPoint.dateFrom));
  const timePointB = dayjs(secondPoint.dateTo).diff(dayjs(secondPoint.dateFrom));
  return timePointB - timePointA;
};

const SortComparers = {
    [SortType.DAY]: pointDayComparer,
    [SortType.PRICE]: pointPriceComparer,
    [SortType.TIME]: pointTimeComparer
}

export { SortComparers };