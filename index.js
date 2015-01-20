var uuid = require('node-uuid');

function Strategy() {}

Strategy.prototype.available = function (callback) {
  callback(null, typeof Media !== 'undefined');
};

Strategy.prototype.create = function () {
  this.data = {};
};

Strategy.prototype.destroy = function () {
  this.data = {};
};

Strategy.prototype.permission = function (callback) {
  callback(null, true);
};

Strategy.prototype.start = function (callback) {
  var self = this;
  var type = window.device.platform === 'Android' ? 'amr' : 'wav';
  var filename = uuid.v1() + '.' + type;

  function onMediaSuccess() {
    callback(null);
  }

  function onMediaError(err) {
    callback(err);
  }

  function onFile(entry) {
    var filepath = 'documents://' + filename;
    self.data.rec = new Media(filepath, onMediaSuccess, onMediaError);
    self.data.rec.startRecord();
    self.data.rec.type = type;
    self.data.rec.url = entry.toURL();
    callback(null);
  }

  function onFileSystem(fs) {
    fs.root.getFile(filename, {create: true}, onFile);
  }

  requestFileSystem(
    LocalFileSystem.PERSISTENT,
    0,
    onFileSystem,
    callback
  );
};

Strategy.prototype.stop = function (callback) {
  var rec = this.data.rec;
  rec.stopRecord();
  callback(null, {type: rec.type, url: rec.url});
};

module.exports = function () {
  return new Strategy();
};
