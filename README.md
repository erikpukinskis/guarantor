Guarantees things will happen, even if an error is thrown or the process is killed:

~~~javascript
var guarantor = require("guarantor")

guarantor(function(callback) {
  your.cleanup.code(callback)
}
~~~