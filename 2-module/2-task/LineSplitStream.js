const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super({...options, encoding: 'utf-8'});
    this.chunks = '';
  }

  _transform(chunk, encoding, callback) {
    this.chunks += chunk.toString();
    callback();
  }

  _flush(callback) {
    this.chunks.split(os.EOL).forEach((ch) => {
      this.push(ch);
    });
    callback();
  }
}

module.exports = LineSplitStream;
