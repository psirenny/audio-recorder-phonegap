var uuid = require('node-uuid');

module.exports = function () {
  return {
    available: function (callback) {
      callback(typeof Media !== 'undefined');
    },
    permission: function (callback) {
      callback(true);
    },
    start: function (callback) {
      var ext = window.device.platform === 'Android' ? '.amr' : '.wav'
      var url = 'documents://' + uuid.v1() + ext;
      this.rec = new Media(url);
      this.rec.url = url;
      this.rec.startRecord();
      callback();
    },
    stop: function (callback) {
      this.rec.stopRecord();
      callback(null, this.rec.url);
    }
  };
};