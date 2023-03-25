import { createElement } from "../render";

const eventTemplate = () => (`<ul class="trip-events__list"></ul>`)

export default class EventsView {
  getTemplate() {
    return eventTemplate;
  }
    
  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }
    
  removeElement() {
    this.element = null;
  }
}
