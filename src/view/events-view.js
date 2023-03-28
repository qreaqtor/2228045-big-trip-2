import { createElement } from "../render";

const eventTemplate = () => (`<ul class="trip-events__list"></ul>`)

export default class EventsView {
  #element = null

  get template() {
    return eventTemplate();
  }
    
  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }
    
  removeElement() {
    this.#element = null;
  }
}
