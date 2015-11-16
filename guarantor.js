
module.exports = guarantor

var cleaners = []
var returned = {}

function guarantor(cleaner) {
  cleaners.push(cleaner)
  cleanUpOnExit()
}

function cleanUpOnExit() {

  process.on('exit', function() {
    cleanUp()

    var remaining = oneRemaining()

    if (remaining) {
      var nice = remaining.toString().replace(/[\n\s]+/g, " ")

      console.log("\nYou wanted to guarantee that "+nice+" ran, but it seems to be doing something asynchronous and Node is shutting down NOW! We tried our best!")
    }
  })

  process.on('SIGINT', function() {
    cleanUp(function() {
      process.exit(2)
    })
  })

  process.on('uncaughtException',
    function(error) {
      cleanUp(function() {
        willGetStuck = false
        console.log(error.stack)
        process.exit(99)
      })
    }
  )

}

function cleanUp(callback) {
  function markFinished(index) {
    returned[index] = true
    if (!oneRemaining()) {
      callback && callback()
    }
  }

  for(var i=0; i<cleaners.length; i++){
    cleaners[i](markFinished.bind(null, i))
  }
}

function oneRemaining() {
  for(var i=0; i<cleaners.length; i++) {
    if (!returned[i]) {
      return cleaners[i]
    }
  }
  return false
}

