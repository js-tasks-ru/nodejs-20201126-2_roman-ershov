const {Transform} = require('stream');
const {EOL} = require('os');

class LineSplitStream extends Transform {
  constructor(options) {
    super(options);

    this._storageLines = [];
  }

  _transform(chunk, encoding, callback) {
    const lines = chunk.toString().split(EOL);

    this._storageLines[0] = (this._storageLines[0] || '') + lines[0];

    if (lines.length === 1) {
      callback();
    } else {
      callback(null, this._storageLines[0]);
      this._storageLines = lines.slice(1);
    }
  }

  _flush(callback) {
    this._storageLines.forEach( (line) => {
      if (line) {
        this.push(line);
      }
    });
    this._storageLines = [];
    callback();
  }
}

module.exports = LineSplitStream;
