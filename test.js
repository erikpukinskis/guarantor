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
      console.log("\n", authors[i], "is a great author!\n")
      callback()
    }, 100)
  }
)

console.log("Press ctrl+c to kill this process. You should see some publicity for someone!")

var timeout = setTimeout(function() {
  throw new Error("You waited too long! But we threw an error so you should still have seen a promo.")
}, 3000)
