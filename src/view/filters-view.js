import AbstractView from "../framework/view/abstract-view";

const createFilterTemplate = (filter, isChecked) => {
  const {name, count} = filter;
  return (
    `<div class="trip-filters__filter">
    <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" ${isChecked ? 'checked' : ''} value="${name}" ${count === 0 ? 'disabled' : ''}>
    <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
  </div>`
  );
};

const createFiltersTemplate = (filterItems) => {
  const filtersTemplate = filterItems.map((filter, index) => createFilterTemplate(filter, index === 0)).join('');
  return `<form class="trip-filters" action="#" method="get">
  ${filtersTemplate}
  <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

export default class FiltersView extends AbstractView{
  #filters = null

  constructor({filters}) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFiltersTemplate(this.#filters);
  }
}
