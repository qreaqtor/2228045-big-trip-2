import { isPointDateInFuture, isPointDateInPast, isPointDateInProgress } from './date';
import { FilterType } from '../consts';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointDateInFuture(point.dateFrom) || isPointDateInProgress(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointDateInPast(point.dateTo) || isPointDateInProgress(point.dateFrom, point.dateTo)),
};

export { filter };
