import { getDateTime } from '../utils/date';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { TYPES } from '../mock/point';
import { toUpperCaseFirstLetter } from '../utils/common';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const renderDestinationPictures = (pictures) => {
  let result = '';
  pictures.forEach((picture) => {
    result = `${result}<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
  });
  return result;
};

const renderDestinationNames = (destinations) => {
  let result = '';
  destinations.forEach((destination) => {
    result = `${result}
    <option value="${destination.name}"></option>`;
  });
  return result;
};

const renderOffers = (allOffers, checkedOffers) => {
  let result = '';
  allOffers.forEach((offer) => {
    const checked = checkedOffers.includes(offer.id) ? 'checked' : '';
    result = `${result}
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-luggage" ${checked}>
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
  });
  return result;
};

const renderEditPointDateTemplate = (dateFrom, dateTo) => (
  `<div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getDateTime(dateFrom)}">
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getDateTime(dateTo)}">
  </div>`
);

const renderEditPointTypeTemplate = (currentType) => TYPES.map((type) => `<div class="event__type-item">
<input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? 'checked' : ''}>
<label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${toUpperCaseFirstLetter(type)}</label>
</div>`).join('');

const editFormTemplate = (point, destinations, offers) => {
  const {basePrice, type, destinationId, dateFrom, dateTo, offerIds} = point;
  const allPointTypeOffers = offers.find((offer) => offer.type === type);
  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event ${type} icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${renderEditPointTypeTemplate(type)}
            </fieldset>
          </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${destinationId}">
          ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${destinationId}" type="text" name="event-destination" value="${destinations[destinationId].name}" list="destination-list-1">
          <datalist id="destination-list-1">
          ${renderDestinationNames(destinations)}
          </datalist>
        </div>
        ${renderEditPointDateTemplate(dateFrom, dateTo)}
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>
        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
          ${renderOffers(allPointTypeOffers.offers, offerIds)}
          </div>
        </section>
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destinations[destinationId].description}</p>
          <div class="event__photos-container">
                      <div class="event__photos-tape">
                      ${renderDestinationPictures(destinations[destinationId].pictures)}
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
  #datepicker = null;

  constructor(point, destinations, offers) {
    super()
    this._state = EditFormView.PointToState(point);
    this.#destinations = destinations;
    this.#offers = offers;
    this.#setHandlers();
    this.#setDatepickerFrom();
    this.#setDatepickerTo();
  }

  removeElement = () => {
    super.removeElement();
    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  };

  get template() {
    return editFormTemplate(this._state, this.#destinations, this.#offers);
  }

  setPreviewClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  }

  reset = (point) => {
    this.updateElement(
      EditFormView.PointToState(point),
    );
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }

  setSubmitClickHandler = (callback) => {
    this._callback.submit = callback;
    this.element.querySelector('.event__save-btn').addEventListener('submit', this.#submitHandler);
  }

  #submitHandler = (evt) => {
    evt.preventDefault();
    this._callback.submit(EditFormView.StateToPoint(this._state));
  }

  _restoreHandlers = () => {
    this.#setHandlers();
    this.setSubmitClickHandler(this._callback.submit);
    this.setPreviewClickHandler(this._callback.click);
    this.#setDatepickerFrom();
    this.#setDatepickerTo();
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
      basePrice: evt.target.value,
    });
  };

  #pointDestinationChangeHandler = (evt) => {
    evt.preventDefault();
    const destination = this.#destinations.find((x) => x.name === evt.target.value);
    this.updateElement({
      destinationId: destination.id,
    });
  };
  
  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offerIds: [],
    });
  };

  #pointOffersChangeHandler = (evt) => {
    evt.preventDefault();
    const checkedOfferId = Number(evt.target.id.slice(-1));
    if (this._state.offerIds.includes(checkedOfferId)) {
      this._state.offerIds = this._state.offerIds.filter((n) => n !== checkedOfferId);
    }
    else {
      this._state.offerIds.push(checkedOfferId);
    }
    this.updateElement({
      offerIds: this._state.offerIds,
    });
  };

  #setHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input').addEventListener('change', this.#pointDestinationChangeHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#pointOffersChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#pointPriceChangeHandler);
  };

  #setDatepickerFrom = () => {
    if (this._state.dateFrom) {
      this.#datepicker = flatpickr(
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
      this.#datepicker = flatpickr(
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

  static PointToState = (point) => ({...point,
    dateTo: dayjs(point.dateTo).toDate(),
    dateFrom: dayjs(point.dateFrom).toDate()
  });

  static StateToPoint = (state) => {
    const point = {...state};
    return point;
  };
}
