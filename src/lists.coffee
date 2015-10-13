module.exports = class Lists
  constructor: (@_conn) ->
    return

  create: (options, callback) =>
    opts = {
      method: "POST"
      url: "/lists"
      body: options
    }
    @_conn.call(opts, callback)

  retrieve: (id, callback) =>
    opts = {
      method: "GET"
      url: "/lists/#{id}"
    }
    @_conn.call(opts, callback)

  update: (id, options, callback) =>
    opts = {
      method: "PUT"
      url: "/lists/#{id}"
      body: options
    }
    @_conn.call(opts, callback)

  del: (id, callback) =>
    opts = {
      method: "DELETE"
      url: "/lists/#{id}"
    }
    @_conn.call(opts, callback)
  
  list: (options, callback) =>
    opts = {
      method: "GET"
      url: "/lists"
      qs: options
    }
    @_conn.call(opts, callback)

  addCompanies: (id, options, callback) =>
    opts = {
      method: "POST"
      url: "/lists/#{id}/companies"
      body: {companies: options.companies}
    }
    @_conn.call(opts, callback)
