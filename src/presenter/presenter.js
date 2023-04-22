import CreateFormView from "../view/create-form-view";
import PointsListView from "../view/points-list-view";
import SortView from "../view/sort-view";
import EmptyPointsListView from "../view/empty-points-list-view";
import PointPresenter from "./point-presenter";
import { render } from "../framework/render";
import { updateItem } from "../utils/common";

export default class EventsPresenter {
    #eventsList = null;
    #container = null;
    #pointsModel = null;
    #boardPoints = null;
    #pointsPresenters = new Map();

    constructor(container) {
        this.#eventsList = new PointsListView();
        this.#container = container;
    }
    
    init(pointsModel) {
        this.#pointsModel = pointsModel;
        this.#boardPoints = [...this.#pointsModel.points];
        if(this.#boardPoints.length === 0) {
            render(new EmptyPointsListView(), this.#container);
        } else {
            render(new SortView(), this.#container);
            render(this.#eventsList, this.#container);
            for (const point of this.#boardPoints) {
                const pointPresenter = new PointPresenter(this.#eventsList, this.#pointsModel, this.#pointChange, this.#hideEditForms);
                pointPresenter.init(point);
                this.#pointsPresenters.set(point.id, pointPresenter);
            }
        }
    }

    #pointChange = (updatedPoint) => {
        this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
        this.#pointsPresenters.get(updatedPoint.id).init(updatedPoint);
    };

    #hideEditForms = () => {
        this.#pointsPresenters.forEach((presenter) => presenter.resetViewToDefault())
    }
}
