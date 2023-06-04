import Observable from '../framework/observable';
import { UpdateType } from '../consts';

export default class PointsModel extends Observable{
  #points = [];
  #pointApiService = null;

  constructor(pointApiService) {
    super();
    this.#pointApiService = pointApiService;
  }

  init = async () => {
    try {
      const points = await this.#pointApiService.points;
      this.#points = points.map(this.#adaptToClient);
    } catch(err) {
      this.#points = [];
    }
    this._notify(UpdateType.INIT);
  };

  get points() {
    return this.#points;
  }

  updatePoint = async (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }
    try {
      const response = await this.#pointApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#points[index] = update;
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  };

  addPoint = (updateType, update) => {
    this.#points.unshift(update);
    this._notify(updateType, update);
  };

  deletePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }
    this.#points.splice(index, 1);
    this._notify(updateType);
  };

  #adaptToClient = (point) => {
    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'] !== null && point['date_from'] != undefined ? new Date(point['date_from']) : point['date_from'],
      dateTo: point['date_to'] !== null && point['date_from'] != undefined ? new Date(point['date_to']) : point['date_to'],
      isFavorite: point['is_favorite'],
    };
    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];
    return adaptedPoint;
  };
}
