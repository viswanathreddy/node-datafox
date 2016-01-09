var _ = require('underscore');
var request = require('request').defaults({jar: false});
var async = require('async');

var Companies = require('./companies');
var Events = require('./events');
var Lists = require('./lists');
var Relateds = require('./relateds');

var API_BASE = 'https://api.datafox.co';
var APP_BASE = 'https://app.datafox.co'

class Connection = function(opts) {
  this._apiVersion = '1.0';
  this._apiUrl = API_BASE + '/' + this._apiVersion;
  this._appUrl = APP_BASE;
  this.clientId = opts.clientId;
  this.clientSecret = opts.clientSecret;
  this.redirectUri = opts.redirectUri;
  this.scope = opts.scope || 'full';
  this.companies = new Companies(this);
  this.events = new Events(this);
  this.lists = new Lists(this);
  this.relateds = new Relateds(this);
  var self = this;
  this._accessTokenQueue = async.queue(function(callback, done) {
    self._getAccessTokenUnsafe(function(err, accessToken) {
      callback(err, accessToken);
      done();
    });
  }, 1);
};

Connection.prototype._request = function(options, callback) {
  var opts = _.chain(options).clone().extend({json: true}).value();
  if (this._requestOptions) {
    opts = _.extend(opts, this._requestOptions);
  }
  opts.url = this._apiUrl + opts.url;
  request(opts, function(err, response, body) {
    callback(err, body);
  });
};

Connection.prototype._setRequestOptions = function(opts) {
  this._requestOptions = opts;
};

Connection.prototype.setTokenData = function(tokenData) {
  if (tokenData.access_token) {
    this.accessToken = tokenData.access_token;
  }
  if (tokenData.refresh_token) {
    this.refreshToken = tokenData.refresh_token;
  }
  if (tokenData.expires_in) {
    this.expires = new Date();
    this.expires.setSeconds(this.expires.getSeconds() + tokenData.expires_in);
  }
};

Connection.prototype.getAuthorizationUrl = function(opts) {
  var scope = (opts && opts.scope) ? opts.scope : 'full';
  var query = {
    client_id: this.clientId,
    redirect_uri: this.redirectUri,
    scope: scope
  };
  var authUrl = this._appUrl + '/oauth2/authorize';
  var queryParams = _.map(query, function(value, key) {
    return key + '=' + encodeURIComponent(value);
  }).join('&');
  return authUrl + '?' + queryParams;
};

Connection.prototype.authorize = function(authCode, callback) {
  if (typeof callback === 'undefined') {
    callback = authCode;
    authCode = undefined;
  }
  var opts = {
    method: 'POST',
    url: '/oauth2/token',
    form: {
      client_id: this.clientId,
      client_secret: this.clientSecret
    }
  };
  if (authCode) {
    opts.form.grant_type = 'authorization_code';
    opts.form.code = authCode;
  } else {
    opts.form.grant_type = 'client_credentials';
    opts.form.scope = 'full';
  }
  var self = this;
  this._request(opts, function(err, body) {
    if (err) {
      callback(err);
      return;
    }
    self.setTokenData(body);
    callback();
  });
};

Conn.prototype._refreshAccessToken = function(callback) {
  var opts = {
    method: 'POST',
    url: '/oauth2/token',
    form: {
      client_id: this.clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: this.refreshToken
    }
  };
  this._request(opts, function(err, body) {
    if (err) {
      callback(err);
      return;
    }
    this.setTokenData(body);
    callback();
  });
};

Connection.prototype._getAccessTokenUnsafe = function(callback) {
  var self = this;
  if (this.accessToken && this.expires > new Date()) {
    async.nextTick(function() {
      callback(null, self.accessToken);
    });
  } else if (this.refreshToken) {
    this._refreshAccessToken(function(err) {
      callback(err, self.accessToken);
    });
  } else {
    async.nextTick(callback);
  }
};

Connection.prototype._getAccessToken = function(callback) {
  this._accessTokenQueue.push(function(err, accessToken) {
    callback(err, accessToken);
  });
};

Connection.prototype.call = function(options, callback) {
  var self = this;
  this._getAccessToken(function(err, accessToken) {
    if (err) {
      callback(err);
      return;
    }
    if (!accessToken) {
      callback(null, {error: 'Authentication Required!'});
      return;
    }
    var opts = _.chain(options).clone().extend({json: true}).value();
    if (!opts.headers) opts.headers = {};
    opts.headers['Authorization'] = 'Bearer ' + accessToken;
    self._request(opts, function(err, body) {
      callback(err, body);
    });
  });
};


module.exports = Connection;