import PointsListView from '../view/points-list-view';
import SortView from '../view/sort-view';
import EmptyPointsListView from '../view/empty-points-list-view';
import LoadingView from '../view/loading-view';
import PointPresenter from './point-presenter';
import { render, RenderPosition, remove } from '../framework/render';
import { SortComparers } from '../utils/sorts';
import { filter } from '../utils/filter.js';
import { UpdateType, UserAction, SortType, FilterType, START_CHECKED_SORT_TYPE, LimitTime } from '../consts.js';
import PointNewPresenter from './point-new-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import NoAdditionalInfoView from '../view/no-additional-info-view';

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
  #noAdditionalInfoComponent = null;

  #pointsPresenter = null;

  #pointNewPresenter = null;
  #currentSortType = null;

  #filterType = null;
  #isLoading = null;
  #uiBlocker = null;

  #clearHeader = null;

  constructor({container, pointsModel, filterModel, destinationsModel, offersModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsPresenter = new Map();
    this.#pointsListComponent = new PointsListView();
    this.#loadingComponent = new LoadingView();
    this.#noAdditionalInfoComponent = new NoAdditionalInfoView();
    this.#pointNewPresenter = new PointNewPresenter({
      pointListContainer: this.#pointsListComponent.element,
      changeData: this.#handleViewAction,
      pointsModel: this.#pointsModel,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel
    });
    this.#currentSortType = START_CHECKED_SORT_TYPE;
    this.#filterType = START_CHECKED_SORT_TYPE;
    this.#isLoading = true;
    this.#uiBlocker = new UiBlocker(LimitTime.LOWER_LIMIT, LimitTime.UPPER_LIMIT);
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

  init(clearHeader) {
    this.#clearHeader = clearHeader;
    this.#renderBoard();
  }

  openCreatePointForm = (callback) => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    if (this.#emptyPointsListComponent) {
      render(this.#pointsListComponent, this.#container);
      remove(this.#emptyPointsListComponent);
    }
    this.#pointNewPresenter.init(callback);
  };

  showNoPointsDescription = () => {
    if(this.#pointsModel.points.length !== 0) {
      return;
    }
    this.#renderNoPointsView();
  };

  #renderNoPointsView = () => {
    this.#emptyPointsListComponent = new EmptyPointsListView(this.#filterType);
    render(this.#emptyPointsListComponent, this.#container, RenderPosition.AFTERBEGIN);
  };

  #renderNoAdditionalInfo = () => {
    render(this.#noAdditionalInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
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
      this.#pointsPresenter.set(point.id, pointPresenter);
    }
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#container, RenderPosition.AFTERBEGIN);
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
    if (this.#offersModel.offers === undefined || this.#destinationsModel.destinations === undefined || this.#pointsModel.points === undefined ||
        this.#offersModel.offers.length === 0 || this.#destinationsModel.destinations.length === 0) {
      this.#renderNoAdditionalInfo();
      this.#clearHeader();
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
    this.#pointsPresenter.forEach((presenter) => presenter.destroy());
    this.#pointsPresenter.clear();
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
    this.#pointsPresenter.forEach((presenter) => presenter.resetViewToDefault());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointsPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#pointNewPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#pointNewPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointsPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointsPresenter.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointsPresenter.get(data.id).init(data);
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
}
