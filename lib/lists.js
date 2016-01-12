var Lists = function(connection) {
  this._conn = connection;
};

Lists.prototype.create = function(options, callback) {
  var opts = {
    method: 'POST',
    url: '/lists',
    body: options
  };
  this._conn.call(opts, callback);
};

Lists.prototype.retrieve = function(id, callback) {
  var opts = {
    method: 'GET',
    url: '/lists/' + id
  };
  this._conn.call(opts, callback);
};

Lists.prototype.update = function(id, options, callback) {
  var opts = {
    method: 'PUT',
    url: '/lists/' + id,
    body: options
  };
  this._conn.call(opts, callback);
};

Lists.prototype.del = function(id, callback) {
  var opts = {
    method: 'DELETE',
    url: '/lists/' + id
  };
  this._conn.call(opts, callback);
};

Lists.prototype.list = function(options, callback) {
  var opts = {
    method: 'GET',
    url: '/lists',
    qs: options
  };
  this._conn.call(opts, callback);
};

Lists.prototype.addCompanies = function(id, options, callback) {
  var opts = {
    method: 'POST',
    url: '/lists/' + id + '/companies',
    body: {companies: options.companies}
  };
  this._conn.call(opts, callback);
};

Lists.prototype.removeCompanies = function(id, options, callback) {
  var opts = {
    method: 'DELETE',
    url: '/lists/' + id + '/companies',
    body: {companies: options.companies}
  };
  this._conn.call(opts, callback);
};

module.exports = Lists;