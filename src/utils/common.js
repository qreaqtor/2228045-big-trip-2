const getRandomInteger = (a = 0, b = 1) => {
    const lower = Math.ceil(Math.min(a, b));
    const upper = Math.floor(Math.max(a, b));
  
    return Math.floor(lower + Math.random() * (upper - lower + 1));
  };
  
const getRandomElement = (elements) => {
    const MIN = 0;
    const max = elements.length - 1;
    return elements[getRandomInteger(MIN, max)];
};

export {getRandomElement, getRandomInteger}