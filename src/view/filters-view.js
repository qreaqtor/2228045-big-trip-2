import AbstractView from '../framework/view/abstract-view';

const createFilterTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  return (
    `<div class="trip-filters__filter">
    <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" ${type === currentFilterType ? 'checked' : ''} value="${type}" ${count === 0 ? 'disabled' : ''}>
    <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
  </div>`
  );
};

const createFiltersTemplate = (filterItems, currentFilterType) => {
  const filtersTemplate = filterItems.map((filter) => createFilterTemplate(filter, currentFilterType)).join('');
  return `<form class="trip-filters" action="#" method="get">
  ${filtersTemplate}
  <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

export default class FiltersView extends AbstractView{
  #filters = null;
  #currentFilterType = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilterType);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  };
}
