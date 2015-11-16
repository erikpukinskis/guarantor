
module.exports = guarantor

var cleaners = []

function guarantor(cleaner) {
  cleaners.push(cleaner)
  cleanUpOnExit()
}

function cleanUpOnExit() {

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
  var returned = {}

  function clockOut(index) {
    returned[index] = true
    for(var i=0; i<cleaners.length; i++) {
      if (!returned[i]) { return }
    }
    callback && callback()
  }

  for(var i=0; i<cleaners.length; i++){
    cleaners[i](clockOut.bind(null, i))
  }
}

