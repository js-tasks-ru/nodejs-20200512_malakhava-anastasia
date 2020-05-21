const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super({...options, encoding: 'utf-8'});
    this.limit = options.limit;
    this.passedBytes = 0;
  }

  _transform(chunk, encoding, callback) {
    this.passedBytes += Buffer.byteLength(chunk);
    if (this.passedBytes > this.limit) {
      this.emit('error', new LimitExceededError());
    }

    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
