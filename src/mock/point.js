import dayjs from 'dayjs'
import { getRandomInteger, getRandomElement } from '../utils/common'
import { nanoid } from 'nanoid';

const COUNT = 10;

const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const DESTINATIONS = ['Amsterdam', 'Chamonix', 'Geneva', 'London'];

const DESCRIPTIONS = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

const ElementsCount = {
    MIN: 1,
    MAX: 5
};
  
const PictureNumber = {
    MIN: 0,
    MAX: 100
};
  
const Price = {
    MIN: 10,
    MAX: 10000
};
  
const generateDescription = () => {
    let description = '';
    for (let i = 0; i < getRandomInteger(ElementsCount.MIN, ElementsCount.MAX); i++) {
      description += ` ${getRandomElement(DESCRIPTIONS)}`;
    }
    return description;
};
  
const generatePicture = () => ({
    src: `http://picsum.photos/248/152?r=${getRandomInteger(PictureNumber.MIN, PictureNumber.MAX)}`,
    description: generateDescription(),
});
  
const generateDestination = (id) => ({
    id,
    description: generateDescription(),
    name: DESTINATIONS[id],
    pictures: Array.from({length: getRandomInteger(ElementsCount.MIN, ElementsCount.MAX)}, generatePicture),
});
  
const getDestinations = () => Array.from({length: DESTINATIONS.length}).map((value, index) => generateDestination(index));
  
const generateOffer = (id, pointType) => ({
    id,
    title: `offer for ${pointType}`,
    price: getRandomInteger(Price.MIN, Price.MAX)
});
  
const generateOffersByType = (pointType) => ({
    type: pointType,
    offers: Array.from({length: getRandomInteger(ElementsCount.MIN, ElementsCount.MAX)}).map((value, index) => generateOffer(index + 1, pointType)),
});
  
const getOffersByType = () => Array.from({length: TYPES.length}).map((value, index) => generateOffersByType(TYPES[index]));
  
const offersByType = getOffersByType();
const destinations = getDestinations();
  
const generatePoint = () => {
    const offersByTypePoint = getRandomElement(offersByType);
    const allOfferIdsByTypePoint = offersByTypePoint.offers.map((offer) => offer.id);
    return {
      basePrice: getRandomInteger(Price.MIN, Price.MAX),
      dateFrom: dayjs().add(getRandomInteger(-3, 0), 'day').add(getRandomInteger(-2, 0), 'hour').add(getRandomInteger(-59, 0), 'minute'),
      dateTo: dayjs().add(getRandomInteger(0, 3), 'day').add(getRandomInteger(0, 2), 'hour').add(getRandomInteger(0, 59), 'minute'),
      destinationId: getRandomElement(destinations).id,
      id: nanoid(),
      isFavorite: Boolean(getRandomInteger()),
      offerIds: Array.from({length: getRandomInteger(0, allOfferIdsByTypePoint.length)}).map(() => allOfferIdsByTypePoint[getRandomInteger(0, allOfferIdsByTypePoint.length - 1)]),
      type: offersByTypePoint.type,
    };
};
  
const getPoints = () => Array.from({length: COUNT}).map(() => generatePoint());
  
export {getPoints, getDestinations, getOffersByType };