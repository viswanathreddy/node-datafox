var Events = function(connection) {
  this._conn = connection;
};

Events.prototype.retrieve = function(id, callback) {
  var opts = {
    method: 'GET',
    url: '/events/' + id
  };
  this._conn.call(opts, callback);
};

Events.prototype.list = function(options, callback) {
  var opts = {
    method: 'GET',
    url: '/events',
    qs: options
  };
  this._conn.call(opts, callback);
};

module.exports = Events;