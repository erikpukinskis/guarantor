
module.exports = guarantor

var cleaners = []

function guarantor(cleaner) {
  cleaners.push(cleaner)
  cleanUpOnExit()
}

function cleanUpOnExit() {

  process.on('exit', function() {
    cleanUp()
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

var willGetStuck = true
var cleaning = false

function cleanUp(callback) {

  if (cleaning) {
    if (willGetStuck) {
      console.log("Finished cleaning up. Hit ctrl+c again to exit")
    }
    return
  }

  var returned = {}
  process.stdin.resume()

  function clockOut(index) {
    returned[index] = true
    for(var i=0; i<cleaners.length; i++) {
      if (!returned[i]) { return }
    }
    callback()
  }

  for(var i=0; i<cleaners.length; i++){
    cleaners[i](clockOut.bind(null, i))
  }
}

