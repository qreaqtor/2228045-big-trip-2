const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

const FilterType = {
  EVERYTHING: 'everything',
  PAST: 'past',
  FUTURE: 'future'
};

const FilterTypeDescriptions = {
  [FilterType.EVERYTHING]: 'Everything',
  [FilterType.PAST]: 'Past',
  [FilterType.FUTURE]: 'Future'
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer',
};

const SortTypeDescriptions = {
  [SortType.DAY]: 'Day',
  [SortType.EVENT]: 'Event',
  [SortType.TIME]: 'Time',
  [SortType.PRICE]: 'Price',
  [SortType.OFFER]: 'Offer',
};

const DISABLED_SORT_TYPES = [SortType.EVENT, SortType.OFFER];

const START_CHECKED_SORT_TYPE = SortType.DAY;

const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

const PointTypes = {
  TAXI: 'taxi',
  BUS: 'bus',
  TRAIN: 'train',
  SHIP: 'ship',
  DRIVE: 'drive',
  FLIGHT: 'flight',
  CHECK_IN: 'check-in',
  SIGHTSEEING: 'sightseeing',
  RESTAURANT: 'restaurant'
};

const PointTypesDescriptions = {
  [PointTypes.TAXI]: 'Taxi',
  [PointTypes.BUS]: 'Bus',
  [PointTypes.TRAIN]: 'Train',
  [PointTypes.SHIP]: 'Ship',
  [PointTypes.DRIVE]: 'Drive',
  [PointTypes.FLIGHT]: 'Flight',
  [PointTypes.CHECK_IN]: 'Check-in',
  [PointTypes.SIGHTSEEING]: 'Sightseeing',
  [PointTypes.RESTAURANT]: 'Restaurant'
};

const ApiServiceResponseMethod = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

const LimitTime = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export { UserAction, UpdateType, FilterType, SortType, NoPointsTextType, DISABLED_SORT_TYPES, START_CHECKED_SORT_TYPE,
  SortTypeDescriptions, FilterTypeDescriptions, PointTypes, PointTypesDescriptions, ApiServiceResponseMethod, LimitTime };
