import PointsListView from '../view/points-list-view';
import SortView from '../view/sort-view';
import EmptyPointsListView from '../view/empty-points-list-view';
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
  #emptyPointsListComponent = null;
  #sortComponent = null;
  #pointsListComponent = new PointsListView();
  #pointsPresenters = new Map();
  #pointNewPresenter = null;
  #currentSortType = null;
  #filterType = FilterType.EVERYTHING;

  constructor(container, pointsModel, filterModel) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#pointNewPresenter = new PointNewPresenter(this.#pointsListComponent.element, this.#handleViewAction, this.#pointsModel);
    this.#currentSortType = StartCheckedSortType;
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
      const pointPresenter = new PointPresenter(this.#pointsListComponent, this.#pointsModel, this.#handleViewAction, this.#hideEditForms);
      pointPresenter.init(point);
      this.#pointsPresenters.set(point.id, pointPresenter);
    }
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
