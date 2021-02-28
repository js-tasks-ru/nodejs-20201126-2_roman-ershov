const {Transform} = require('stream');
const {EOL} = require('os');

class LineSplitStream extends Transform {
  constructor(options) {
    super(options);

    this._storageLines = [];
  }

  _transform(chunk, encoding, callback) {
    const lines = chunk.toString().split(EOL);

    this._storageLines[Math.max(this._storageLines.length - 1, 0)] = (
      (this._storageLines[this._storageLines.length - 1] || '') + lines[0]
    );
    this._storageLines = [...this._storageLines, ...lines.slice(1)];

    if (this._storageLines.length > 1) {
      callback(null, this._storageLines.shift());
    } else {
      callback();
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
