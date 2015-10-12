module.exports = class Lists
  constructor: (@_conn) ->
    return

  retrieve: (id, callback) =>
    opts = {
      method: "GET"
      url: "/lists/#{id}"
    }
    @_conn.call(opts, callback)

  create: (options, callback) =>
    opts = {
      method: "POST"
      url: "/lists"
      body: options
    }
    @_conn.call(opts, callback)

  del: (id, callback) =>
    opts = {
      method: "DELETE"
      url: "/lists/#{id}"
    }
    @_conn.call(opts, callback)

  addCompanies: (id, companyIds, callback) =>
    opts = {
      method: "POST"
      url: "/lists/#{id}/companies"
      body: {companies: companyIds}
    }
    @_conn.call(opts, callback)
