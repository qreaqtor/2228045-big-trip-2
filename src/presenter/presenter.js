import CreateFormView from "../view/create-form-view";
import PointsListView from "../view/points-list-view";
import SortView from "../view/sort-view";
import EmptyPointsListView from "../view/empty-points-list-view";
import PointPresenter from "./point-presenter";
import { render } from "../framework/render";
import { updateItem } from "../utils/common";
import { SortComparers, SortType } from "../utils/sorts";

export default class EventsPresenter {
  #pointsList = null;
  #container = null;
  #pointsModel = null;
  #boardPoints = null;
  #pointsPresenters = new Map();

  #currentSortType = null;
  #originalBoardPoints = null;
  #sortComponent = null;

  constructor(container) {
    this.#pointsList = new PointsListView();
    this.#sortComponent = new SortView();
    this.#container = container;
    this.#currentSortType = SortType.DAY;
  }
    
  init(pointsModel) {
    this.#pointsModel = pointsModel;
    this.#boardPoints = [...this.#pointsModel.points];
    this.#originalBoardPoints = [...this.#pointsModel.points];
    if(this.#boardPoints.length === 0) {
        this.#renderNoPointsView();
    } else {
        this.#renderSortView();
        this.#renderPointsListView();
    }
  }

  #renderNoPointsView = () => {
    render(new EmptyPointsListView(), this.#container);
  }

  #renderSortView = () => {
    this.#sortPoint(this.#currentSortType);
    render(this.#sortComponent, this.#container);
    this.#sortComponent.setSortingHandler(this.#handleSortTypeChange);
  }

  #renderPointsListView = () => {
    render(this.#pointsList, this.#container);
    this.#renderPoints();
  }

  #renderPoints = () => {
    for (const point of this.#boardPoints) {
        const pointPresenter = new PointPresenter(this.#pointsList, this.#pointsModel, this.#pointChange, this.#hideEditForms);
        pointPresenter.init(point);
        this.#pointsPresenters.set(point.id, pointPresenter);
    }
  }

  #sortPoint = (sortType) => {
    this.#boardPoints.sort(SortComparers[sortType]);
    this.#currentSortType = sortType;
  };
    
  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
        return;
    }
    this.#sortPoint(sortType);
    this.#clearPoints();
    this.#renderPoints();
  };

  #clearPoints = () => {
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();
  }

  #pointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#originalBoardPoints = updateItem(this.#originalBoardPoints, updatedPoint);
    this.#pointsPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #hideEditForms = () => {
    this.#pointsPresenters.forEach((presenter) => presenter.resetViewToDefault())
  }
}
