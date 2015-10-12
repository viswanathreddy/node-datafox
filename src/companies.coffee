module.exports = class Companies
  constructor: (@_conn) ->
    return

  retrieve: (id, callback) =>
    opts = {
      method: "GET"
      url: "/companies/#{id}"
    }
    @_conn.call(opts, callback)

  list: (options, callback) =>
    opts = {
      method: "GET"
      url: "/companies"
      qs: options
    }
    @_conn.call(opts, callback)

  details: (id, options, callback) =>
    opts = {
      method: "GET"
      url: "/companies/#{id}/details"
    }
    @_conn.call(opts, callback)

  fundingRounds: (id, callback) =>
    opts = {
      method: "GET"
      url: "/companies/#{id}/funding-rounds"
    }
    @_conn.call(opts, callback)
