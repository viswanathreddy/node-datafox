var Companies = function(connection) {
  this._conn = connection;
};

Companies.prototype.create = function(options, callback) {
  var opts = {
    method: 'POST',
    url: '/companeis',
    body: options
  };
  this._conn.call(opts, callback);
};

Companies.prototype.retrieve = function(id, callback) {
  var opts = {
    method: 'GET',
    url: '/companies/' + id
  };
  this._conn.call(opts, callback);
};

Companies.prototype.list = function(options, callback) {
  var opts = {
    method: 'GET',
    url: '/companies',
    qs: options
  };
  this._conn.call(opts, callback);
};

Companies.prototype.details = function(id, callback) {
  var opts = {
    method: 'GET',
    url: '/companies/' + id + '/details'
  };
  this._conn.call(opts, callback);
};

Companies.prototype.fundingRounds = function(id, callback) {
  var opts = {
    method: 'GET',
    url: '/companies/' + id + '/funding-rounds'
  };
  this._conn.call(opts, callback);
};

module.exports = Companies;