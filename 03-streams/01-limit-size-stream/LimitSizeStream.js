const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.total = 0;
  }

  _transform(chunk, encoding, callback) {
    this.total += chunk.length;

    if (this.total > this.limit) {
      let error = new LimitExceededError();

      this.emit('error', error);
      callback(error, chunk);
    } else {
      callback(null, chunk);
    }

  }
}

module.exports = LimitSizeStream;
