/*
This file connects the discord module to the discord API and begins to listen for commands, as well as sets up other modules.
*/
const Discord = require('discord.js')
const client = new Discord.Client()
const Music = require('./music')
const Core = require('./core')
var env = process.env.NODE_ENV || 'discord'
var config = require ('./config')[env]

const token = config.token

const PREFIX = '!'
//connect to discord and check that client is ready
client.on('ready', () =>{
    console.log('The client is online')
})

//listen to discord messages
client.on('message', msg=>{
    let args = msg.content.substring(PREFIX.length).split(" ")
    
    //switch between different commands
    switch(String(args[0]).toLowerCase()){
        case 'help':
            switch(String(args[1]).toLowerCase()){
                case 'core':
                    Core.Help(msg)
                    break
                case 'music':
                    Music.Help(msg)
                    break
                default:
                    msg.reply("You can say Help Core, or Help Music to get more details")
            }
            break
        case 'delete':
            Core.Delete(msg,args)
            break
        case 'connect':
            Core.Connect(msg)
            break
        case 'disconnect':
            Core.Disconnect(msg)
            break
        case 'play':
            Music.Play(msg,args)
            break
        case 'skip':
            Music.Skip(msg,args)
            break
        case 'stop':
            Music.Stop(msg,args)
            break
        case 'pause':
            Music.Pause(msg)
            break
        case 'resume':
            Music.Resume(msg)
            break
        case 'clear':
            Music.Clear(msg, args)
            break
        case 'remove':
            Music.Remove(msg,args)
            break
        case 'queue':
            Music.Queue(msg)
            break
        case 'fade':
            Music.Fade(msg, args)
            break
        /*case 'test':
            msg.channel.send("Unknown error using fade. Please try again. If problem persists please report issue at https://github.com/MKeefeus/Mkeefeus-Multiplaftorm-Media-Manager/issues")
            break*/
    }
})


//login to discord
client.login(token)

/*
common checks
msg.guild.voice Checks if Bot has connected to a voice channel. Returns undefined if not
msg.guild.voice.channelID == null checks if bot is currently connect to a voice channel. Only check after ensuring a connection has been made either with hasplayed in music or with msg.guild.voice
msg.member.voice.channel Checks if a connection to a voice channel exists for a user
msg.guild.voice.connection.speaking.bitfield == 1 check if bot is talking. Only use after ensure that msg.guild.voice exists.

msg.member is the typer of the message (user)
msg.guild represents the server. 
You ARE the bot
*/