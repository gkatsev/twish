var util = require('util')
  , twitter = require('twitter')
  , colors = require('colors')
  , repl = require('repl')
  , keys = require('./keys')
  , local = repl.start()
  , first = true

var twish = new twitter(keys)

local.context.repl = local
local.context.colors = colors
local.context.twish = twish

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

local.defineCommand('reload', function(){
  twish.get('/statuses/home_timeline.json', function(data){
    console.log('\n')
    data.reverse().forEach(function(data){writeData(data)})
    local.rli._refreshLine()
  })
})
local.commands['.reload'].help = 'Reload the home timeline'

local.defineCommand('replies', function(){
  twish.get('/statuses/mentions.json', function(data){
    console.log('\n')
    data.reverse().forEach(function(data){writeData(data)})
    local.rli._refreshLine()
  })
})
local.commands['.replies'].help = "Get latest replies"

//twish.stream('statuses/sample', function(stream){
twish.stream('user', {track:'gkatsev', delimited:20}, function(stream){
  stream.on('data', function(data){
    if(first){
      first = false
      return
    }
    console.log('\n')
    writeData(data)
    local.rli._refreshLine()
  })
})

function writeData(data){
  var date = new Date(data.created_at).toString().split(' ')
    , dates

  date.splice(5,2)
  date.splice(3,1)
  date.unshift(date.pop())
  dates = date.join(' ')

  console.log(
    colors.yellow(dates)
  , colors.green(data.user && data.user.screen_name)
  , colors.white(data.text)
  )
}
module.exports = twish
