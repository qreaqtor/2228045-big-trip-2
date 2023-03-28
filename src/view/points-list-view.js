import { createElement } from "../render";

const pointsListTemplate = () => (`<ul class="trip-events__list"></ul>`)

export default class PointsListView {
  #element = null

  get template() {
    return pointsListTemplate();
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
