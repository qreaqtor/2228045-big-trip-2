const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
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

const DisabledSortTypes = [SortType.EVENT, SortType.OFFER];

const StartCheckedSortType = SortType.DAY;

const SortTypeDescriptions = {
  [SortType.DAY]: 'Day',
  [SortType.EVENT]: 'Event',
  [SortType.TIME]: 'Time',
  [SortType.PRICE]: 'Price',
  [SortType.OFFER]: 'Offer',
};

const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

const PointTypes = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export { UserAction, UpdateType, FilterType, SortType, NoPointsTextType, DisabledSortTypes, StartCheckedSortType, SortTypeDescriptions, FilterTypeDescriptions, PointTypes };
