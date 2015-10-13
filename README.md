# node-datafox
DataFox API wrapper for Node

See https://datafox.co/docs/api/?javascript

Quickstart:

```javascript
var datafox = require('datafox');
// input your client id, client secret, and redirect uri registered with DataFox
var conn = new datafox.Connection({
  clientId: "CLIENT ID",
  clientSecret: "CLIENT SECRET",
  redirectUri: "REDIRECT URI"
});
// authorize the user associated to your client
conn.authorize(function(err) {
  if (err) {
    console.log(error);
    return;
  }
  console.log('access token: ' + conn.accessToken);
  console.log('refresh token: ' + conn.refreshToken);
  console.log('access token expires: ' + conn.accessTokenExpires);
  conn.companies.list({url: 'datafox.co'}, function(err, json) {
    if (err) {
      console.error(err);
      return;
    }
    console.log('found ' + json.total_count + ' companies!');
  });
});
```
