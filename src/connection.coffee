_ = require('underscore')
request = require('request').defaults({jar: false})
async = require('async')

Companies = require('./companies')
Events = require('./events')
Lists = require('./lists')
Relateds = require('./relateds')


module.exports = class Connection
  constructor: (opts) ->
    @_apiVersion = '1.0'
    @_apiUrl = "https://api.datafox.co/" + @_apiVersion
    @_appUrl = "https://app.datafox.co"
    @clientId = opts.clientId
    @clientSecret = opts.clientSecret
    @redirectUri = opts.redirectUri
    @scope = opts.scope ? 'full'
    @companies = new Companies(this)
    @events = new Events(this)
    @lists = new Lists(this)
    @relateds = new Relateds(this)
    accessTokenQueueFunction = (cb, done) =>
      @_getAccessTokenUnsafe((err, accessToken) =>
        cb(err, accessToken)
        done()
      )
    @_accessTokenQueue = async.queue(accessTokenQueueFunction, 1)

  _request: (options, callback) =>
    opts = _.chain(options).clone().extend({json: true}).value()
    # TODO: remove
    opts = _.extend(opts, {strictSSL: false})
    opts.url = @_apiUrl + opts.url
    request(opts, (err, response, body) =>
      callback(err, body)
    )


  setTokenData: (tokenData) =>
    @accessToken = tokenData.access_token
    @refreshToken = tokenData.refresh_token
    if tokenData.expires_in
      @_expiresIn = tokenData.expires_in
      @_expires = new Date
      @_expires.setSeconds(@_expires.getSeconds() + @_expiresIn)
    return

  getAuthorizationUrl: (opts) =>
    scope = opts?.scope ? 'full'
    query = {
      client_id: @clientId
      redirect_uri: @redirectUri
      scope: scope
    }
    authUrl = @_appUrl + "/oauth2/authorize"
    queryParams = _.map(query, (value, key) ->
      return "#{key}=#{encodeURIComponent(value)}"
    ).join("&")
    return authUrl + "?" + queryParams


  authorize: (authCode, callback) =>
    if callback is undefined
      callback = authCode
      authCode = undefined
    opts = {
      method: 'POST'
      url: '/oauth2/token'
      form: {
        client_id: @clientId
        client_secret: @clientSecret
      }
    }
    if authCode
      opts.form.grant_type = 'authorization_code'
      opts.form.code = authCode
    else
      opts.form.grant_type = 'client_credentials'
      opts.form.scope = 'full'
    @_request(opts, (err, body) =>
      return callback(err) if err
      @setTokenData(body)
      callback()
    )


  _refreshAccessToken: (callback) =>
    opts = {
      method: 'POST'
      url: '/oauth2/token'
      form: {
        client_id: @clientId
        client_secret: @clientSecret
        grant_type: 'refresh_token'
        refresh_token: @refreshToken
      }
    }
    @_request(opts, (err, body) =>
      return callback(err) if err
      @setTokenData(body)
      callback()
    )


  _getAccessTokenUnsafe: (callback) =>
    if @accessToken and @_expires > new Date
      async.nextTick(=> callback(null, @accessToken))
    else if @refreshToken
      @_refreshAccessToken((err) =>
        callback(err, @accessToken)
      )
    else
      callback()

  _getAccessToken: (callback) =>
    @_accessTokenQueue.push((err, accessToken) =>
      callback(err, accessToken)
    )

  # assumes opts = {method: 'GET', url: "xxx", qs: {...}}
  call: (options, callback) =>
    @_getAccessToken((err, accessToken) =>
      return callback(err) if err
      return callback(null, {error: "Authentication Required!"}) unless accessToken
      opts = _.clone(options)
      opts = _.extend(opts, {json: true})
      opts.headers = _.extend(opts.headers ? {}, {
        'Authorization': 'Bearer ' + accessToken
      })
      opts.url = opts.url
      @_request(opts, (err, body) =>
        callback(err, body)
      )
    )

  get: (options, callback) =>
    opts = _.chain(options).clone().extend({method: 'GET'}).value()
    @call(opts, callback)

  post: (options, callback) =>
    opts = _.chain(options).clone().extend({method: 'POST'}).value()
    @call(opts, callback)

