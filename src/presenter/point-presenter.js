import RoutePointView from '../view/route-point-view';
import EditFormView from '../view/edit-form-view';
import { remove, render, replace } from '../framework/render';
import { UserAction, UpdateType } from '../consts.js';

const Mode = {
  DEFAULT: 'default',
  EDITING: 'editing',
};

export default class PointPresenter {
  #pointComponent = null;
  #formEditComponent = null;
  #pointsList = null;
  #point = null;
  #destinations = null;
  #offers = null;
  #mode = Mode.DEFAULT;

  #changeData = null;
  #changeMode = null;

  constructor(pointsList, pointsModel, changeData, changeMode) {
    this.#pointsList = pointsList;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#destinations = [...pointsModel.destinations];
    this.#offers = [...pointsModel.offers];
  }

  init(point) {
    const prevPointComponent = this.#pointComponent;
    const prevFormEditComponent = this.#formEditComponent;
    this.#point = point;
    this.#pointComponent = new RoutePointView(this.#point, this.#destinations, this.#offers);
    this.#formEditComponent = new EditFormView({
      point: point,
      destinations: this.#destinations,
      offers: this.#offers,
      isNewPoint: false
    });
    this.#pointComponent.setFavouriteClickHandler(this.#handlefavouriteClick);
    this.#pointComponent.setEditClickHandler(this.#replacePointToEditForm);
    this.#formEditComponent.setPreviewClickHandler(this.resetViewToDefault);
    this.#formEditComponent.setSubmitClickHandler(this.#handleFormSubmit);
    this.#formEditComponent.setDeleteClickHandler(this.#handleDeleteClick);
    if(prevPointComponent === null || prevFormEditComponent === null) {
      render(this.#pointComponent, this.#pointsList.element);
      return;
    }
    switch (this.#mode) {
      case Mode.DEFAULT:
        replace(this.#pointComponent, prevPointComponent);
        break;
      case Mode.EDITING:
        replace(this.#formEditComponent, prevFormEditComponent);
        break;
    }
    remove(prevPointComponent);
    remove(prevFormEditComponent);
  }

  resetViewToDefault = () => {
    if(this.#mode === Mode.EDITING) {
      this.#formEditComponent.reset(this.#point);
      this.#replaceEditFormToPoint();
    }
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#formEditComponent);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.resetViewToDefault();
    }
  };

  #replacePointToEditForm = () => {
    replace(this.#formEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceEditFormToPoint = () => {
    replace(this.#pointComponent, this.#formEditComponent);
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.DEFAULT;
  };

  #handlefavouriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite},
    );
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point,
    );
    this.#replaceEditFormToPoint();
  };

  #handleDeleteClick = (point) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };
}
