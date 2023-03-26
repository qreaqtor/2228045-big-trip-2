import CreateFormView from "../view/create-form-view";
import EditFormView from "../view/edit-form-view";
import EventsView from "../view/events-view";
import RoutePointView from "../view/route-point-view";
import SortView from "../view/sort-view";
import { render } from "../render";

export default class EventsPresenter {
    constructor(container) {
        this.eventsList = new EventsView();
        this.container = container;
    }
    
    init(pointsModel) {
        this.pointsModel = pointsModel;
        this.boardPoints = [...pointsModel.getPoints()];
        this.destinations = [...pointsModel.getDestinations()];
        this.offers = [...pointsModel.getOffers()];
        render(new SortView(), this.container);
        render(this.eventsList, this.container);
        render(new EditFormView(this.boardPoints[0], this.destinations, this.offers), this.eventsList.getElement());
        for (const point of this.boardPoints) {
            render(new RoutePointView(point, this.destinations, this.offers), this.eventsList.getElement());
        }
        render(new CreateFormView(), this.container);
    }
}
