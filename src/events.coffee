module.exports = class Events
  constructor: (@_conn) ->
    return

  retrieve: (id, callback) =>
    opts = {
      method: "GET"
      url: "/events/#{id}"
    }
    @_conn.call(opts, callback)

  list: (options, callback) =>
    opts = {
      method: "GET"
      url: "/events"
      qs: options
    }
    @_conn.call(opts, callback)
