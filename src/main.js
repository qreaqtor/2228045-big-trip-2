import HeaderPresenter from './presenter/header-presenter';
import EventsPresenter from './presenter/events-presenter';
import PointsModel from './model/points-model';
import { getPoints, getDestinations, getOffersByType } from './mock/point';
import FilterModel from './model/filter-model';

const siteHeaderElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.page-main');

const points = getPoints();
const destinations = getDestinations();
const offers = getOffersByType();

const pointsModel = new PointsModel();
const filtersModel = new FilterModel();

pointsModel.init(points, destinations, offers);

const eventsPresenter = new EventsPresenter(siteMainElement.querySelector('.trip-events'), pointsModel, filtersModel);
eventsPresenter.init();

const headerPresenter = new HeaderPresenter(siteHeaderElement, eventsPresenter.openCreatePointForm, pointsModel, filtersModel);
headerPresenter.init();
