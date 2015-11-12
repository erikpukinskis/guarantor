
var dirtyItems = {}
var cleaners = {}

module.exports = guarantor

function guarantor(cleaner, label) {
  cleaner.label = label

  var guaranteeId = Math.random().toString(36).split(".")[1].slice(0,5)

  cleaners[guaranteeId] = cleaner

  var boundGuarantee = guarantee.bind(null, guaranteeId)

  boundGuarantee.forget = forget.bind(null, guaranteeId)

  return boundGuarantee
}

function guarantee(guaranteeId, dirtyItem, id) {
  cleanUpOnExit(guaranteeId)
  dirtyItems[guaranteeId][id] = dirtyItem
}

function forget(guaranteeId, id) {
  delete dirtyItems[guaranteeId][id]
}

function cleanUpOnExit(guaranteeId) {

  if (dirtyItems[guaranteeId]) {
    return
  }

  dirtyItems[guaranteeId] = {}

  process.on('exit', cleanUp)

  process.on('SIGINT',
    cleanUp.bind(null,
      process.exit.bind(null, 2)
    )
  )

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
  process.stdin.resume()

  if (cleaning) {
    if (willGetStuck) {
      console.log("Finished cleaning up. Hit ctrl+c again to exit")
    }
    return
  }
  cleaning = true
  var explained = false

  var ids = Object.keys(cleaners)

  function cleanAnother() {
    var guaranteeId = ids.pop()
    if (!guaranteeId) {
      return callback()
    }
    cleanUpItems(
      dirtyItems[guaranteeId],
      cleaners[guaranteeId],
      cleanAnother
    )
  }

  cleanAnother()
}

function cleanUpItems(items, cleaner, callback) {
  var ids = Object.keys(items)

  if (ids.length) {
    console.log("\nWe have", ids.length, (cleaner.label||"item")+"(s) still to clean up. Working on it... hit ctrl+c to give up")
  }

  function resignMore() {
    var id = ids.pop()

    if (!id) {
      return callback()
    }
    var item = items[id]
    cleaner(item, id, resignMore)
  }

  resignMore()
}

