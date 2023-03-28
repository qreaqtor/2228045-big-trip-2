import { createElement } from "../render";

const menuTemplate = () => (`<nav class="trip-controls__trip-tabs  trip-tabs">
<a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
<a class="trip-tabs__btn" href="#">Stats</a>
</nav>`)

export default class MenuView {
  #element = null

  get template() {
    return menuTemplate();
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
