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
      var basename = 'documents://' + uuid.v1();
      var extname = window.device.platform === 'Android' ? '.amr' : '.wav';
      this.rec = new Media(basename + extname);
      this.rec.startRecord();
      callback();
    },
    stop: function (callback) {
      this.rec.stopRecord();
      callback();
    }
  };
};