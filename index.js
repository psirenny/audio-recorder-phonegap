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

  this.data.onSuccess = function () {
    // do nothing because the callback will fire in onFile()
  };

  this.data.onError = function (err) {
    // return an error and disable the callback in onFire()
    callback(err);
    callback = function () {};
  };

  function onMediaSuccess() {
    self.data.onSuccess();
  }

  function onMediaError(err) {
    self.data.onError(err);
  }

  function onFile(entry) {
    var filepath = 'documents://' + filename;
    self.data.rec = new Media(filepath, onMediaSuccess, onMediaError);
    self.data.rec.startRecord();
    self.data.rec.type = type;
    self.data.rec.url = entry.toURL();
    setTimeout(callback, 0);
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

  this.data.onError = function (err) {
    callback(err);
  };

  this.data.onSuccess = function () {
    callback(null, {type: rec.type, url: rec.url});
  };

  rec.stopRecord();
};

module.exports = function () {
  return new Strategy();
};
