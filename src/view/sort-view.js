import AbstractView from '../framework/view/abstract-view';
import { SortType, DisabledSortTypes, SortTypeDescriptions } from '../consts';

const createSortTemplate = (currentSortType) => {
  const sortTypes = Object.values(SortType);
  const sortsTemplate = sortTypes.map((sortType) =>
    `<div class="trip-sort__item  trip-sort__item--${sortType}">
      <input ${currentSortType === sortType ? 'checked' : ''} id="sort-${sortType}" data-sort-type=${sortType} class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortType}" ${DisabledSortTypes.includes(sortType) ? 'disabled' : ''}>
      <label class="trip-sort__btn" for="sort-${sortType}">${SortTypeDescriptions[sortType]}</label>
    </div>`).join('');
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">${sortsTemplate}</form>`;
};

export default class SortView extends AbstractView{
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  setSortingHandler = (callback) => {
    this._callback.sorting = callback;
    this.element.addEventListener('click', this.#sortingHandler);
  };

  #sortingHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    evt.preventDefault();
    this._callback.sorting(evt.target.dataset.sortType);
  };
}
