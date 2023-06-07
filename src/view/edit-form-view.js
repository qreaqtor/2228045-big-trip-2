import { getDateTime } from '../utils/date';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { PointTypes, PointTypesDescriptions } from '../consts';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';

const getDefaultPoint = () => ({
  basePrice: 100,
  dateFrom: dayjs(),
  dateTo: dayjs(),
  destination: 1,
  isFavorite: false,
  offers: [],
  type: PointTypes.TAXI,
});

const renderDestinationPictures = (pictures) => pictures.length === 0 ? '' : pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('');

const renderDestinationNames = (destinations) => destinations.length === 0 ? '' : destinations.map((destination) => `<option value="${destination.name}"></option>`).join('');

const renderOffers = (allOffers, checkedOffers, isDisabled) => !allOffers || allOffers.length === 0 ? '' : allOffers.map((offer) =>
  `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-luggage" 
      ${checkedOffers.includes(offer.id) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
    <label class="event__offer-label" for="event-offer-${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`).join('');

const renderEditPointDateTemplate = (dateFrom, dateTo, isDisabled) => (
  `<div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getDateTime(dateFrom)}" ${isDisabled ? 'disabled' : ''}>
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getDateTime(dateTo)}" ${isDisabled ? 'disabled' : ''}>
  </div>`
);

const renderEditPointTypeTemplate = (currentType, isDisabled) => Object.values(PointTypes).map((type) => `<div class="event__type-item">
<input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
<label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${PointTypesDescriptions[type]}</label>
</div>`).join('');

const renderResetButtonTemplate = (isNewPoint, isDisabled, isDeleting) => isNewPoint ?
  `<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>Cancel</button>` :
  `<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>`;

const editFormTemplate = (point, destinations, alloffers, isNewPoint) => {
  const {basePrice, type, destination, dateFrom, dateTo, offers, isDisabled, isSaving, isDeleting} = point;
  const allPointTypeOffers = alloffers.find((offer) => offer.type === type);
  const destinationData = destinations.find((item) => item.id === destination);
  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event ${type} icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${renderEditPointTypeTemplate(type, isDisabled)}
            </fieldset>
          </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${destination}">
          ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${destination}" type="text" name="event-destination" 
            value="${destinationData ? he.encode(destinationData.name) : ''}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
          <datalist id="destination-list-1">
          ${renderDestinationNames(destinations)}
          </datalist>
        </div>
        ${renderEditPointDateTemplate(dateFrom, dateTo, isDisabled)}
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}" ${isDisabled ? 'disabled' : ''}>
        </div>
        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
        ${renderResetButtonTemplate(isNewPoint, isDisabled, isDeleting)}
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
          ${renderOffers(allPointTypeOffers.offers, offers, isDisabled)}
          </div>
        </section>
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destinationData.description}</p>
          <div class="event__photos-container">
                      <div class="event__photos-tape">
                      ${renderDestinationPictures(destinationData.pictures)}
                      </div>
                    </div>
        </section>
      </section>
    </form>
  </li>`);
};

export default class EditFormView extends AbstractStatefulView {
  #destinations = null;
  #offers = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #isNewPoint = null;

  constructor({point = getDefaultPoint(), destinations, offers, isNewPoint}) {
    super();
    this._state = EditFormView.PointToState(point);
    this.#destinations = destinations;
    this.#offers = offers;
    this.#isNewPoint = isNewPoint;
    this._restoreHandlers();
  }

  get template() {
    return editFormTemplate(this._state, this.#destinations, this.#offers, this.#isNewPoint);
  }

  setPreviewClickHandler = (callback) => {
    this._callback.previewClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#previewClickHandler);
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
  };

  removeElement = () => {
    super.removeElement();
    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  };

  reset = (point) => {
    this.updateElement(
      EditFormView.PointToState(point),
    );
  };

  _restoreHandlers = () => {
    this.#setHandlers();
    this.#setOuterHandlers();
    this.#setDatepickerFrom();
    this.#setDatepickerTo();
  };

  #setOuterHandlers = () => {
    if (!this.#isNewPoint) {
      this.setPreviewClickHandler(this._callback.previewClick);
    }
    this.setSubmitClickHandler(this._callback.submit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  };

  #previewClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.previewClick();
  };

  setSubmitClickHandler = (callback) => {
    this._callback.submit = callback;
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#submitHandler);
  };

  #setHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input').addEventListener('change', this.#pointDestinationChangeHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#pointOffersChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#pointPriceChangeHandler);
  };

  #setDatepickerFrom = () => {
    if (this._state.dateFrom) {
      this.#datepickerFrom = flatpickr(
        this.element.querySelector('#event-start-time-1'),
        {
          enableTime: true,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dateFrom,
          maxDate: this._state.dateTo,
          onChange: this.#pointDateFromChangeHandler,
        },
      );
    }
  };

  #setDatepickerTo = () => {
    if (this._state.dateTo) {
      this.#datepickerTo = flatpickr(
        this.element.querySelector('#event-end-time-1'),
        {
          enableTime: true,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dateTo,
          minDate: this._state.dateFrom,
          onChange: this.#pointDateToChangeHandler,
        },
      );
    }
  };

  #submitHandler = (evt) => {
    evt.preventDefault();
    this._callback.submit(EditFormView.StateToPoint(this._state));
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(EditFormView.StateToPoint(this._state));
  };

  #pointDateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #pointDateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #pointPriceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: Number(evt.target.value),
    });
  };

  #pointDestinationChangeHandler = (evt) => {
    evt.preventDefault();
    const destination = this.#destinations.find((x) => x.name === evt.target.value);
    if(destination === undefined) {
      return;
    }
    this.updateElement({
      destination: destination.id,
    });
  };

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._state.offers = [];
    this.updateElement({
      type: evt.target.value,
    });
  };

  #pointOffersChangeHandler = (evt) => {
    evt.preventDefault();
    const checkedOfferId = Number(evt.target.id.slice(-1));
    if (this._state.offers.includes(checkedOfferId)) {
      this._state.offers = this._state.offers.filter((n) => n !== checkedOfferId);
    }
    else {
      this._state.offers.push(checkedOfferId);
    }
    this.updateElement({
      offers: this._state.offers,
    });
  };

  static PointToState = (point) => ({...point,
    dateTo: dayjs(point.dateTo).toDate(),
    dateFrom: dayjs(point.dateFrom).toDate(),
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });

  static StateToPoint = (state) => {
    const point = {...state};
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  };
}
