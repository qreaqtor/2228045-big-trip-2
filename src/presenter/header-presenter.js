import { render, replace, remove } from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import { filter } from '../utils/filter.js';
import { FilterType, UpdateType, FilterTypeDescriptions, SortType } from '../consts.js';
import NewPointButtonView from '../view/new-point-button-view.js';
import MenuView from '../view/menu-view.js';
import InfoView from '../view/info-view.js';
import { SortComparers } from '../utils/sorts.js';

export default class HeaderPresenter {
  #filterContainer = null;
  #btnContainer = null;
  #menuContainer = null;
  #infoContainer = null;

  #openCreatePointForm = null;
  #renderEmptyPointsList = null;

  #filtersModel = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #filtersComponent = null;
  #newPointButtonComponent = null;
  #menuComponent = null;
  #infoComponent = null;

  constructor({btnContainer, filterContainer, menuContainer, infoContainer, newEventClick, newEventCancel, pointsModel, filtersModel, destinationsModel, offersModel}) {
    this.#btnContainer = btnContainer;
    this.#filterContainer = filterContainer;
    this.#menuContainer = menuContainer;
    this.#infoContainer = infoContainer;
    this.#openCreatePointForm = newEventClick;
    this.#renderEmptyPointsList = newEventCancel;
    this.#filtersModel = filtersModel;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
    this.#destinationsModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);
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
    if(this.#menuComponent === null) {
      this.#renderMenu();
    }
    if(this.#newPointButtonComponent === null) {
      this.#renderButton();
    }
    this.#renderFilters();
    this.#renderInfo();
  };

  clearHeader = () => {
    this.#newPointButtonComponent.element.disabled = true;
    remove(this.#infoComponent);
    remove(this.#filtersComponent);
  };

  #renderFilters = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filtersComponent;
    this.#filtersComponent = new FiltersView(filters, this.#filtersModel.filter);
    this.#filtersComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);
    if (prevFilterComponent === null) {
      render(this.#filtersComponent, this.#filterContainer);
      return;
    }
    replace(this.#filtersComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #renderInfo = () => {
    if(this.#infoComponent !== null) {
      remove(this.#infoComponent);
    }
    const sortPoints = [...this.#pointsModel.points].sort(SortComparers[SortType.DAY]);
    const destinations = [...this.#destinationsModel.destinations];
    const offers = [...this.#offersModel.offers];
    this.#infoComponent = new InfoView(sortPoints, destinations, offers);
    render(this.#infoComponent, this.#infoContainer);
  };

  #renderMenu = () => {
    this.#menuComponent = new MenuView();
    render(this.#menuComponent, this.#menuContainer);
  };

  #renderButton = () => {
    this.#newPointButtonComponent = new NewPointButtonView();
    render(this.#newPointButtonComponent, this.#btnContainer);
    this.#newPointButtonComponent.setClickHandler(this.#handleNewPointButtonClick);
  };

  #handleNewPointFormClose = () => {
    this.#newPointButtonComponent.element.disabled = false;
    this.#renderEmptyPointsList();
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
