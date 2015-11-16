var guarantor = require("./")

var authors = [
  "Ursula K. Leguin",
  "Octavia Butler",
  "Margaret Atwood"
]

guarantor(
  function(callback) {
    setTimeout(function() {
      var i = Math.floor(Math.random()*3)

      console.log(authors[i], "is a great author!")
      
      callback()
    }, 100)
  }
)

console.log("Press ctrl+c to kill this process. You should see some publicity for someone!")

var timeout = setTimeout(function() {}, 30000)