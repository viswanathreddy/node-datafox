module.exports = class Relateds
  constructor: (@_conn) ->
    return

  list: (options, callback) =>
    opts = {
      method: "GET"
      url: "/relateds"
      qs: options
    }
    @_conn.call(opts, callback)
