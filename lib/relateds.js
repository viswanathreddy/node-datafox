var Relateds = function(connection) {
  this._conn = connection;
}

Relateds.prototype.list = function(options, callback) {
  var opts = {
    method: 'GET',
    url: '/relateds',
    qs: options
  };
  this._conn.call(opts, callback);
};