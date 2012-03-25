var util = require('util')
  , twitter = require('twitter')
  , Stream = require('stream')
  , repl = require('repl')
  , keys = require('./keys')
  , local = repl.start()
  , first = true

var twish = new twitter(keys)

local.context.repl = local
local.defineCommand('tweet', function(tweet){
  twish
    .verifyCredentials(function(data) {
      console.log(util.inspect(data))
    })
    .updateStatus(tweet,
      function(data) {
        console.log(util.inspect(data))
    })
})
local.commands['.tweet'].help = 'Tweet as currently signed in user'

twish.stream('user', {track:'gkatsev', delimited:20}, function(stream){
  stream.on('data', function(data){
    if(first){
      first = false
      return
    }
    setTimeout(function(){
      process.stdout.write(JSON.stringify(data, null, '  '))
    }, 500)
  })
})

module.exports = twish
