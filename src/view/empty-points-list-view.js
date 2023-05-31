import AbstractView from '../framework/view/abstract-view';
import { NoPointsTextType } from '../consts.js';

const createEmptyPointsListTemplate = (filterType) => {
  const noPointTextValue = NoPointsTextType[filterType];
  return (
    `<p class="trip-events__msg">
      ${noPointTextValue}
    </p>`);
};

export default class EmptyPointsListView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyPointsListTemplate(this.#filterType);
  }
}
