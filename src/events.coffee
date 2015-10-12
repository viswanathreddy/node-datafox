module.exports = class Events
  constructor: (@_conn) ->
    return

  list: (options, callback) =>
    opts = {
      method: "GET"
      url: "/events"
      qs: options
    }
    @_conn.call(opts, callback)

  retrieve: (id, callback) =>
    opts = {
      method: "GET"
      url: "/events/#{id}"
    }
    @_conn.call(opts, callback)
