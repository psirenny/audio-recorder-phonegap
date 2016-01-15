'use strict';

/* global Media */

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
  var fileProtocol = window.cordova.platformId === 'ios' ? 'documents://' : '';
  var fileExt = window.cordova.platformId === 'android' ? 'amr' : 'wav';
  var fileType = window.cordova.platformId === 'android' ? '3gp' : 'wav';
  var fileName = uuid.v1() + '.' + fileExt;

  function onCreateMediaSuccess() {
    self.data.rec.callback();
  }

  function onCreateMediaFailure(err) {
    self.data.rec.callback(err);
  }

  function onCreateFileSuccess(file) {
    var mediaSrc = fileProtocol ? (fileProtocol + fileName) : file.nativeURL;
    self.data.rec = new Media(mediaSrc, onCreateMediaSuccess, onCreateMediaFailure);
    self.data.rec.type = fileType;
    self.data.rec.url = file.nativeURL;
    self.data.rec.startRecord();
    callback();
  }

  function onCreateFileFailure(err) {
    callback(err);
  }

  function onGetDirectorySuccess(dir) {
    dir.getFile(
      fileName,
      {create: true},
      onCreateFileSuccess,
      onCreateFileFailure
    );
  }

  function onGetDirectoryFailure(err) {
    callback(err);
  }

  function onGetFileSystemSuccess(fs) {
    onGetDirectorySuccess(fs.root);
  }

  function onGetFileSystemFailure(err) {
    callback(err);
  }

  if (window.cordova.platformId === 'android') {
    window.resolveLocalFileSystemURL(
      window.cordova.file.externalCacheDirectory,
      onGetDirectorySuccess,
      onGetDirectoryFailure
    );
  } else {
    window.requestFileSystem(
      window.LocalFileSystem.PERSISTENT,
      0,
      onGetFileSystemSuccess,
      onGetFileSystemFailure
    );
  }
};

Strategy.prototype.stop = function (callback) {
  var rec = this.data.rec;
  var result = {type: rec.type, url: rec.url};
  rec.callback = function (err) { callback(err, result); };
  rec.stopRecord();
  rec.release();

  if (window.cordova.platformId === 'android') {
    rec.callback();
  }
};

module.exports = function () {
  return new Strategy();
};
