const isNotNumber = (arg) => typeof arg !== 'number';

const sum = (a, b) => {
  if (isNotNumber(a) || isNotNumber(b)) {
    throw new TypeError();
  }

  return a + b;
};

module.exports = sum;
