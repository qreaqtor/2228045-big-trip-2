import AbstractView from '../framework/view/abstract-view.js';
import { humanizePointDueDate } from '../utils/date.js';

const renderRouteTrip = (points, destinations) => {
  if (points.length === 0) {
    return '';
  }
  const routeWithoutRepeats = [points[0].destination];
  for (let i = 1; i < points.length; i++) {
    if (points[i].destination !== points[i-1].destination) {
      routeWithoutRepeats.push(points[i].destination);
    }
  }
  if (routeWithoutRepeats.length > 3) {
    const startPoint = destinations.find((item) => item.id === routeWithoutRepeats[0]);
    const endPoint = destinations.find((item) => item.id === routeWithoutRepeats[routeWithoutRepeats.length - 1]);
    return `${startPoint.name} &mdash; ... &mdash; ${endPoint.name}`;
  }
  return routeWithoutRepeats.map((destination) => `${destinations.find((item) => item.id === destination).name}`).join(' &mdash; ');

};

const renderDates = (points) => {
  if (points.length === 0) {
    return '';
  }
  const startDate = points[0].dateFrom !== null ? humanizePointDueDate(points[0].dateFrom) : '';
  const endDate = points[points.length - 1].dateTo !== null ? humanizePointDueDate(points[points.length - 1].dateTo) : '';
  return `${startDate}&nbsp;&mdash;&nbsp;${endDate}`;
};

const getPricePointOffers = (point, offers) => {
  if (offers.length === 0) {
    return 0;
  }
  let pricePointOffers = 0;
  const offersByType = offers.find((offer) => offer.type === point.type);
  const pointOffers = point.offers;
  pointOffers.forEach((offer) => {
    pricePointOffers += offersByType.offers.find((item) => item.id === offer).price;
  });
  return pricePointOffers;
};

const renderTotalPrice = (points, offers) => {
  if (points.length === 0) {
    return '';
  }
  let totalPrice = 0;
  points.forEach((point) => {
    totalPrice += point.basePrice;
    totalPrice += getPricePointOffers(point, offers);
  });
  return `Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>`;
};

const createInfoTemplate = (points, destinations, offers) => {
  if(offers.length === 0 || destinations === 0) {
    return '<div class="trip-info"><div class="trip-info__main"></div></div>';
  }
  return  `<div class="trip-info"><div class="trip-info__main">
    <h1 class="trip-info__title">${renderRouteTrip(points, destinations)}</h1>
    <p class="trip-info__dates">${renderDates(points)}</p>
  </div>
  <p class="trip-info__cost">${renderTotalPrice(points, offers)}</p></div>`;
};

export default class InfoView extends AbstractView {
  #points = null;
  #destinations = null;
  #offers = null;

  constructor(points, destinations, offers) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createInfoTemplate(this.#points, this.#destinations, this.#offers);
  }
}
