import CreateFormView from "../view/create-form-view";
import EditFormView from "../view/edit-from-view";
import EventsView from "../view/events-view";
import RoutePointView from "../view/route-point-view";
import SortView from "../view/sort-view";

import { render } from "../render";

export default class EventsPresenter
{
    constructor(container) 
    {
        this.eventsList = new EventsView();
        this.container = container;
    }
    
    init()
    {
        render(new SortView(), this.container);
        render(this.eventsList, this.container);
        render(new EditFormView(), this.eventsList.getElement());
        for (let i = 0; i < 3; i++)
        {
          render(new RoutePointView(), this.eventsList.getElement());
        }
        render(new CreateFormView(), this.eventsList.getElement());
    }
}