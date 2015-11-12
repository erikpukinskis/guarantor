var guarantor = require("./")

var guaranteePublicity = guarantor(
  function(person, name) {
    console.log(name, "who is", person.age, "exists!")
    clearTimeout(timeout)
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

console.log("Press ctrl+c to kill this process. You should see some publicity for someone!")

var timeout = setTimeout(function() {}, 30000)