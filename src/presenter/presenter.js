import CreateFormView from "../view/create-form-view";
import EditFormView from "../view/edit-form-view";
import PointsListView from "../view/points-list-view";
import RoutePointView from "../view/route-point-view";
import SortView from "../view/sort-view";
import EmptyPointsListView from "../view/empty-points-list-view";
import { render } from "../render";

export default class EventsPresenter {
    #eventsList = null;
    #container = null;
    #pointsModel = null;
    #boardPoints = null;
    #destinations = null;
    #offers = null;

    constructor(container) {
        this.#eventsList = new PointsListView();
        this.#container = container;
    }
    
    init(pointsModel) {
        this.#pointsModel = pointsModel;
        this.#boardPoints = [...this.#pointsModel.points];
        this.#destinations = [...this.#pointsModel.destinations];
        this.#offers = [...this.#pointsModel.offers];
        if(this.#boardPoints.length === 0) {
            render(new EmptyPointsListView(), this.#container);
        } else {
            render(new SortView(), this.#container);
            render(this.#eventsList, this.#container);
            for (const point of this.#boardPoints) {
                this.#renderPoint(point)
            }
        }
    }

    #renderPoint = (point) => {
        const pointComponent = new RoutePointView(point, this.#destinations, this.#offers)
        const formEditComponent = new EditFormView(point, this.#destinations, this.#offers);
        const replacePointToEditForm = () => {
            this.#eventsList.element.replaceChild(formEditComponent.element, pointComponent.element);
        };
        const replaceEditFormToPoint = () => {
            this.#eventsList.element.replaceChild(pointComponent.element, formEditComponent.element);
        };
        const onEscKeyDown = (evt) => {
            if (evt.key === 'Escape' || evt.key === 'Esc') {
                evt.preventDefault();
                replaceEditFormToPoint();
                document.removeEventListener('keydown', onEscKeyDown);
            }
        };
        pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
            replacePointToEditForm();
            document.addEventListener('keydown', onEscKeyDown);
        });
        formEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', (evt) => {
            evt.preventDefault();
            replaceEditFormToPoint();
            document.removeEventListener('keydown', onEscKeyDown);
        });
        formEditComponent.element.querySelector('form').addEventListener('submit', (evt) => {
            evt.preventDefault();
            replaceEditFormToPoint();
            document.removeEventListener('keydown', onEscKeyDown);
        });
        render(pointComponent, this.#eventsList.element);
    }
}
