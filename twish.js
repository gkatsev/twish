var util = require('util')
  , twitter = require('twitter')
  , colors = require('colors')
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
      var obj = {}
      obj.user = data.user.screen_name
      obj.text = data.text
      obj.data = data.created_at
      process.stdout.write(JSON.stringify(obj, null, '  '))
    }, 500)
  })
})

module.exports = twish
