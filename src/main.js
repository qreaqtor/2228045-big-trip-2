import FiltersView from "./view/filters-view";
import MenuView from "./view/menu-view";
import EventsPresenter from "./presenter/presenter";
import { render } from "./framework/render";
import PointsModel from "./model/points-model";
import { getPoints, getDestinations, getOffersByType } from "./mock/point";
import { generateFilters } from "./mock/filters";

const siteHeaderElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.page-main');
const tripPresenter = new EventsPresenter(siteMainElement.querySelector('.trip-events'));

const points = getPoints();
const destinations = getDestinations();
const offers = getOffersByType();

const pointsModel = new PointsModel();
pointsModel.init(points, destinations, offers);
tripPresenter.init(pointsModel);

const filters = generateFilters(points)

render(new FiltersView({filters}), siteHeaderElement.querySelector('.trip-controls__filters'));
render(new MenuView(), siteHeaderElement.querySelector('.trip-controls__navigation'));