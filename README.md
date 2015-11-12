Guarantees things will happen, even if an error is thrown or the process is killed:

~~~javascript
var guarantor = require("guarantor")

var guaranteePublicity = guarantor(
  function(person, name) {
    console.log(name, "who is", person.age, "exists!")
  },
  "publications"
)

guaranteePublicity(
  {age: 12},
  "betty draper"
)

guaranteePublicity(
  {age: 4000},
  "the earth"
)

guaranteePublicity.forget("the earth")

setTimeout(function() {
  console.log("Press ctrl+c to kill this process. You should see some publicity for someone!")
}, 30000)
~~~
