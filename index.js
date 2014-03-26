var uuid = require('node-uuid');

module.exports = function () {
  return {
    available: function (callback) {
      callback(typeof Media !== 'undefined');
    },
    clear: function (callback) {
      this.rec = null;
      callback();
    },
    name: 'phonegap',
    permission: function (callback) {
      callback(true);
    },
    send: function (url, callback) {
      var transfer = new FileTransfer();
      var opts = new FileUploadOptions();
      opts.chunkedMode = false;
      opts.fileKey = 'audio';
      opts.fileName = this.rec.uri.substr(this.rec.uri.lastIndexOf('/') + 1);
      opts.mimeType = 'audio/' + this.rec.ext;
      transfer.upload(this.rec.uri, url, function (data) {
        var res = JSON.parse(data.response);
        callback(null, res);
      }, callback, opts);
    },
    start: function (callback) {
      var self = this
        , ext = window.device.platform === 'Android' ? 'amr' : 'wav'
        , fileName = uuid.v1() + '.' + ext;

      requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
        fileSystem.root.getFile(fileName, {create: true}, function (fileEntry) {
          self.rec = new Media('documents://' + fileName);
          self.rec.startRecord();
          self.rec.ext = ext;
          self.rec.uri = fileEntry.toURI();
          callback();
        }, callback);
      }, callback);
    },
    stop: function (callback) {
      this.rec.stopRecord();
      callback(null, this.rec.url);
    }
  };
};