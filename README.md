Guarantees things will happen, even if an error is thrown or the process is killed:

~~~javascript
var guarantor = require("guarantor")

guarantor(function(callback) {
  your.cleanup.code(callback)
}
~~~

Test the three code paths:

Run `npm test` and wait for an error to be thrown.

Run `npm test` and hit ctrl+c.

Run `npm test normal exit` to see the warning we throw when we don't have time to wait for the callbacks.