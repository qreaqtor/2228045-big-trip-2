import { isPointDateInFuture, isPointDateInPast } from './date';
import { FilterType } from '../consts';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointDateInFuture(point.dateFrom)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointDateInPast(point.dateTo)),
};

export { filter };
