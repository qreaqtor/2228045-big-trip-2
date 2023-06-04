import PointsListView from '../view/points-list-view';
import SortView from '../view/sort-view';
import EmptyPointsListView from '../view/empty-points-list-view';
import LoadingView from '../view/loading-view';
import PointPresenter from './point-presenter';
import { render, RenderPosition, remove } from '../framework/render';
import { SortComparers } from '../utils/sorts';
import { filter } from '../utils/filter.js';
import { UpdateType, UserAction, SortType, FilterType, StartCheckedSortType } from '../consts.js';
import PointNewPresenter from './point-new-presenter.js';

export default class EventsPresenter {
  #container = null;
  #pointsModel = null;
  #filterModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #emptyPointsListComponent = null;
  #sortComponent = null;
  #pointsListComponent = null;
  #loadingComponent = null;
  #pointsPresenters = null;
  #pointNewPresenter = null;
  #currentSortType = null;
  #filterType = null;
  #isLoading = null;

  constructor({container, pointsModel, filterModel, destinationsModel, offersModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsPresenters = new Map();
    this.#pointsListComponent = new PointsListView();
    this.#loadingComponent = new LoadingView();
    this.#pointNewPresenter = new PointNewPresenter({
      pointListContainer: this.#pointsListComponent.element, 
      changeData: this.#handleViewAction, 
      pointsModel: this.#pointsModel,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel
    });
    this.#currentSortType = StartCheckedSortType;
    this.#filterType = FilterType.EVERYTHING;
    this.#isLoading = true;
    this.#destinationsModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);
    filteredPoints.sort(SortComparers[this.#currentSortType]);
    return filteredPoints;
  }

  init() {
    this.#renderBoard();
  }

  openCreatePointForm = (callback) => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init(callback);
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #renderNoPointsView = () => {
    this.#emptyPointsListComponent = new EmptyPointsListView(this.#filterType);
    render(this.#emptyPointsListComponent, this.#container, RenderPosition.AFTERBEGIN);
  };

  #renderSortView = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortingHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#container, RenderPosition.AFTERBEGIN);
  };

  #renderPoints = (points) => {
    for (const point of points) {
      const pointPresenter = new PointPresenter({
        pointsListContainer: this.#pointsListComponent,
        changeData: this.#handleViewAction, 
        changeMode: this.#hideEditForms,
        destinationsModel: this.#destinationsModel,
        offersModel: this.#offersModel
      });
      pointPresenter.init(point);
      this.#pointsPresenters.set(point.id, pointPresenter);
    }
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#container, RenderPosition.AFTERBEGIN);
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointsPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPoints();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearPoints({resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        remove(this.#emptyPointsListComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPoints();
    this.#renderBoard();
  };

  #renderPointsList = (points) => {
    render(this.#pointsListComponent, this.#container);
    this.#renderPoints(points);
  };

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    const points = this.points;
    const pointCount = points.length;
    if (pointCount === 0) {
      this.#renderNoPointsView();
      return;
    }
    this.#renderSortView();
    this.#renderPointsList(points);
  };

  #clearPoints =  ({resetSortType = false} = {}) => {
    this.#pointNewPresenter.destroy();
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();
    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    if (this.#emptyPointsListComponent) {
      remove(this.#emptyPointsListComponent);
    }
    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #hideEditForms = () => {
    this.#pointNewPresenter.destroy();
    this.#pointsPresenters.forEach((presenter) => presenter.resetViewToDefault());
  };
}
