import HeaderPresenter from './presenter/header-presenter';
import EventsPresenter from './presenter/events-presenter';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';
import DestinationsModel from './model/destination-model';
import OffersModel from './model/offers-model';
import PointsApiService from './api-service/points-api-service';
import DestinationsApiService from './api-service/destinations-api-service';
import OffersApiService from './api-service/offers-api-service';

const AUTHORIZATION = 'Basic hGfqdqd01tqudb33';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const siteHeaderElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.page-main');

const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const destinationsModel = new DestinationsModel(new DestinationsApiService(END_POINT, AUTHORIZATION));
const offersModel = new OffersModel(new OffersApiService(END_POINT, AUTHORIZATION));
const filtersModel = new FilterModel();

const eventsPresenter = new EventsPresenter({
  container: siteMainElement.querySelector('.trip-events'),
  pointsModel: pointsModel,
  filterModel: filtersModel,
  destinationsModel: destinationsModel,
  offersModel: offersModel
});

const headerPresenter = new HeaderPresenter({
  btnContainer: siteHeaderElement,
  filterContainer: siteHeaderElement.querySelector('.trip-controls__filters'),
  menuContainer: siteHeaderElement.querySelector('.trip-controls__navigation'),
  infoContainer: siteHeaderElement.querySelector('.trip-main__trip-info'),
  newEventClick: eventsPresenter.openCreatePointForm,
  newEventCancel: eventsPresenter.showNoPointsDescription,
  pointsModel: pointsModel,
  filtersModel: filtersModel,
  destinationsModel: destinationsModel,
  offersModel: offersModel
});

eventsPresenter.init(headerPresenter.clearHeader);
headerPresenter.init();

offersModel.init().finally(() => {
  destinationsModel.init().finally(() => {
    pointsModel.init();
  });
});
