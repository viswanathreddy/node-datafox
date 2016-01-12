var SimilarCompanies = function(connection) {
  this._conn = connection;
}

SimilarCompanies.prototype.list = function(options, callback) {
  var opts = {
    method: 'GET',
    url: '/similar-companies',
    qs: options
  };
  this._conn.call(opts, callback);
};

module.exports = SimilarCompanies;