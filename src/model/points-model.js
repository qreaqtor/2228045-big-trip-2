import Observable from '../framework/observable';

export default class PointsModel extends Observable{
  #points = [];
  #offers = [];
  #destinations = [];

  init(points, destinations, offers) {
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  updatePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }
    this.#points[index] = update;
    this._notify(updateType, update);
  };

  addPoint = (updateType, update) => {
    this.#points.unshift(update);
    this._notify(updateType, update);
  };

  deletePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }
    this.#points.splice(index, 1);
    this._notify(updateType);
  };
}
