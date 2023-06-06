import { render, replace, remove } from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import { filter } from '../utils/filter.js';
import { FilterType, UpdateType, FilterTypeDescriptions } from '../consts.js';
import NewPointButtonView from '../view/new-point-button-view.js';
import MenuView from '../view/menu-view.js';

export default class HeaderPresenter {
  #filterContainer = null;
  #btnContainer = null;
  #menuContainer = null;

  #openCreatePointForm = null;

  #filtersModel = null;
  #pointsModel = null;

  #filterComponent = null;
  #newPointButtonComponent = null;
  #menuComponent = null;

  constructor({container, btnClick, pointsModel, filtersModel}) {
    this.#btnContainer = container;
    this.#filterContainer = container.querySelector('.trip-controls__filters');
    this.#menuContainer = container.querySelector('.trip-controls__navigation');
    this.#openCreatePointForm = btnClick;
    this.#filtersModel = filtersModel;
    this.#pointsModel = pointsModel;
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#pointsModel.points;
    const filterTypes = Object.values(FilterType);
    return filterTypes.map((type) => ({
      type: type,
      name: FilterTypeDescriptions[type],
      count: filter[type](points).length
    }));
  }

  init = () => {
    if(this.#newPointButtonComponent === null) {
      this.#renderButton();
    }
    if(this.#menuComponent === null) {
      this.#renderMenu();
    }
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;
    this.#filterComponent = new FiltersView(filters, this.#filtersModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);
    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }
    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #renderMenu = () => {
    this.#menuComponent = new MenuView();
    render(this.#menuComponent, this.#menuContainer);
  };

  #renderButton = () => {
    this.#newPointButtonComponent = new NewPointButtonView();
    render(this.#newPointButtonComponent, this.#btnContainer);
    this.#newPointButtonComponent.setClickHandler(this.#handleNewPointButtonClick);
    // if (this.#offersModel.offers.length === 0 || this.#destinationsModel.destinations.length === 0) {
    //   this.#newPointButtonComponent.element.disabled = true;
    // }
  };

  #handleNewPointFormClose = () => {
    this.#newPointButtonComponent.element.disabled = false;
  };

  #handleNewPointButtonClick = () => {
    this.#openCreatePointForm(this.#handleNewPointFormClose);
    this.#newPointButtonComponent.element.disabled = true;
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filtersModel.filter === filterType) {
      return;
    }
    this.#filtersModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
