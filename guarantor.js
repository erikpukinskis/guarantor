
module.exports = guarantor

var cleaners = []
var returned = {}

function guarantor(cleaner) {
  cleaners.push(cleaner)
  cleanUpOnExit()
}

function cleanUpOnExit() {
  process.on('exit', function() {
    if (cleaning) { return }
    cleanUp(0)
    var remaining = oneRemaining()

    if (remaining) {
      var source = remaining.toString().replace(/[\n\s]+/g, " ")

      if (source.length > 51) {
        source = source.slice(0,50)+"..."
      }

      console.log("\nYou wanted to guarantee that \""+source+"\" ran, but it seems to be doing something asynchronous and Node is shutting down NOW! We tried our best!")
    }
  })

  process.on('SIGINT', function() {
    cleanUp(2, function() {
      process.exit(2)
    })
  })

  process.on('uncaughtException',
    function(error) {
      console.log(error.stack, "\n")
      cleanUp(99, function() {
        willGetStuck = false
        process.exit(99)
      })
    }
  )

}

var cleaning = false

function cleanUp(status, callback) {
  if (cleaning) { return }
  else { cleaning = true }

  function markFinished(index) {
    returned[index] = true
    if (!oneRemaining()) {
      callback && callback()
    }
  }

  for(var i=0; i<cleaners.length; i++){
    var finishThis = markFinished.bind(null, i)
    cleaners[i](finishThis, status)
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

