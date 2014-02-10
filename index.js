module.exports = function () {
  return {
    available: function (callback) {
      callback(typeof Media !== 'undefined');
    },
    permission: function (callback) {
      return callback(true);
    },
    start: function (callback) {
      return callback();
    },
    stop: function (callback) {
      return callback();
    }
  };
};