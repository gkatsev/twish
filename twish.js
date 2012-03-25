var util = require('util')
  , twitter = require('twitter')
  , Stream = require('stream')
  , repl = require('repl')
  , keys = require('./keys')
  , local = repl.start()

local.context.repl = local
local.defineCommand('tweet', function(tweet){
  twit
    .verifyCredentials(function(data) {
      console.log(util.inspect(data))
    })
    .updateStatus('Test tweet from node-twitter/' + twitter.VERSION,
      function(data) {
        console.log(util.inspect(data))
    })
})


var twish = new twitter(keys)
//twish.get('/statuses/show/183682338646011904.json', function(data){
  //console.log(data)
//})
//twish.stream('statuses/sample', function(stream){
twish.stream('user', {track:'gkatsev', delimited:20}, function(stream){
  stream.on('data', function(data){
    setTimeout(function(){
      process.stdout.write(JSON.stringify(data, null, '  '))
    }, 1000)
  })
})

module.exports = twish
