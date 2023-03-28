import { createElement } from "../render";

const emptyPointsListTemplate = () => (`<p class="trip-events__msg">Click New Event to create your first point</p>`)

export default class EmptyPointsListView {
  #element = null

  get template() {
    return emptyPointsListTemplate();
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
