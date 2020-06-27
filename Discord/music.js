/*
This module holds all the music functionallity. It uses YTDL to play audio from a given youtube URL and implements basic commands to manage the queue 
*/
const worker = require('worker_threads');
var servers = {}
const ytdl = require("ytdl-core")
var hasPlayed = false
module.exports = {
    Play: function (msg,args) {
        function play(connection, msg){
            var server = servers[msg.guild.id]
            if(!server.queue[1]){
                ytdl.getInfo(server.queue[0], (err, info) => {
                    if (err) throw err
                    msg.channel.send("Playing "+info.title)
                })
                server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audioonly"}))
                hasPlayed = true
                server.dispatcher.on("finish", function(){
                    server.queue.shift()
                    if(server.queue[0]){
                        play(connection, msg)
                    }
                })
            }
        }
        if(!servers[msg.guild.id]){ 
            servers[msg.guild.id] = {
                queue: []
            }
        }
        var server = servers[msg.guild.id]
        if(server.dispatcher){
            if(server.dispatcher.paused){
                server.dispatcher.resume()
                msg.channel.send("Playing")
                return
            }
        }
        else if(!args[1]){
            msg.reply("You need to provide a link")
            return
        }
        else if(!msg.member.voice.channel){
            msg.reply("You need to be in a voice channel")
            return
        }
        server.queue.push(args[1])
        if(!msg.member.voice.connection){
            msg.member.voice.channel.join().then(function(connection){
                play(connection, msg)
            })
        }
    },
    //add number of songs to skip
    Skip: function (msg) {
        if(hasPlayed){
            var server = servers[msg.guild.id]
            if(server.dispatcher){
                server.dispatcher.end()
                msg.channel.send('Skipping')
            }
        }
        else{
            msg.channel.send('Please start the music before using the other music commands')
        }
    },

    Stop: function (msg){
        if(hasPlayed){
            var server = servers[msg.guild.id]
            if(msg.guild.voice){
                if(msg.guild.voice.connection.speaking.bitfield == 1){
                    for(var i = server.queue.length -1; i >=0; i--){
                        server.queue.splice(i, 1)
                    }

                    server.dispatcher.end()
                    msg.channel.send('Stopping')
                }
                else{
                    msg.channel.send("I'm not playing anything, use !play to add something to the queue")
                }
            }
            else{
                msg.channel.send("I am not currently in a voice channel")
            }
        }
        else{
            msg.channel.send('Please start the music before using the other music commands')
        }

    },

    Pause: function (msg){
        if(hasPlayed){
            var server = servers[msg.guild.id]
            if(server.dispatcher){
                server.dispatcher.pause()
                msg.channel.send("Paused")
            }
        }
        else{
            msg.channel.send('Please start the music before using the other music commands')
        }
    },
    
    Resume: function (msg){
        if(hasPlayed){
            var server = servers[msg.guild.id]
            if(server.dispatcher){
                server.dispatcher.resume()
                msg.channel.send("Playing")
            }
        }
        else{
            msg.channel.send('Please start the music before using the other music commands')
        }
    },

    Clear: function (msg, args){
        if(hasPlayed){
            var server = servers[msg.guild.id]
            if(msg.guild.voice){
                if(server.queue.length == 0){
                    msg.channel.send("Queue is already empty, use !play to add to the queue")
                }
                else{
                    for(var i = server.queue.length; i>=1; i--){
                        server.queue.splice(i,1)
                    }
                    msg.channel.send("Queue has been cleared")
                }
            }
            else{
                msg.channel.send("Queue is already empty, use !play to add to the queue")
            }
        } 
        else{
            msg.channel.send('Please start the music before using the other music commands')
        }     
    },
    Remove: function(msg,args){
        if(hasPlayed){
            var server = servers[msg.guild.id]
            if(!args[1]){
                msg.reply("Please specify which location in queue you want removed")
            }
            else if(args[2]){
                server.queue.splice(Number(args[1]), Number(args[2]))
            }
            else{
                server.queue.splice(Number(args[1]),1)
            }
        }
        else{
            msg.channel.send('Please start the music before using the other music commands')
        }
    },
    //retreive metadata
    Queue: function(msg){
        if(hasPlayed){
            var server = servers[msg.guild.id]
            msg.channel.send(server.queue)
            console.log(server.queue)
        }
        else{
            msg.channel.send('Please start the music before using the other music commands')
        } 
    },
    Fade: function(msg, args){
 
        function reduce_volume(dispatcher, increment, args, start_volume){

            function setup_increase(dispatcher, increment, start_volume){

                function increase_volume(dispatcher, increment, start_volume){
                    var current_vol = dispatcher.volume
                    if(dispatcher.volume >= start_volume){
                        console.log(dispatcher.volume)
                        clearInterval(increase_interval)
                    }
                    dispatcher.setVolume(current_vol + increment)
                }

                dispatcher.setVolume(0)
                var increase_interval = setInterval(increase_volume, 100, server.dispatcher, increment, start_volume)
                clearTimeout(wait)
            }
            
            var current_vol = dispatcher.volume
            if(dispatcher.volume <= 0){
                server.queue.splice(1, 0, args[1])
                server.dispatcher.end()
                var wait = setTimeout(setup_increase, 5000, dispatcher, increment, start_volume)
                clearInterval(reduce_interval)
            }
            dispatcher.setVolume(current_vol - increment)
        }


        if(msg.guild.voice){
            var server = servers[msg.guild.id]
            if(msg.guild.voice.connection.speaking.bitfield == 1){
                var start_volume = (server.dispatcher.volume)
                var increment = start_volume*.02
                var reduce_interval = setInterval(reduce_volume, 100, server.dispatcher, increment, args, start_volume) 
            }   
        }
    },

    Help: function(msg){
        msg.reply("\n"+
        "!Play [Link]: Play a song or add song to the queue if a song is already playing"+
        "make sure to play first before using the other commands\n"+
        "!Puase: Pause the song\n"+
        "!Resume/!Play: Resume the song\n"+
        "!Skip: Skip to the next song in the queue\n"+
        "!Stop: Stops the music and empties the queue\n"+
        "!Clear: Clears all but the current song from the queue\n"+
        "!Fade [Link]: Lower the volume to 0, start the next song, bring volume back up. This places the link at the front of the queue\n")

    }
}