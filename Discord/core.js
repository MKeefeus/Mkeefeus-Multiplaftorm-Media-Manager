/*
This file houses basic functions and moderation for discord
*/
module.exports = {
    //Display to user the different options in this module
    Help: function(msg){
        msg.reply("\n"+
        "!Delete [number of messages]: Deletes the given number of messages from the chat\n"
        +"!Connect: Connects bot to the voice channel you are in\n"
        +"!Disconnect: Disconnects the bot from the voice channel")
    },

    //Delete [args] number of messages in the channel the command is posted in
    Delete: function(msg, args){
        if(args[1] && parseInt(args[1]) != NaN){
            msg.channel.bulkDelete(parseInt(args[1]))  
        }
        else if(!args[1]){
            return msg.reply('Please sepcify a number of messages to delete (ex. 5)')
        }
        else if(parseInt(args[1]) == NaN)
        {
            return msg.reply('Please state the number of messages as a whole number (ex. 5)')
        }
        else{
            return msg.channel.send('Unkown error deleteing messages. Please try again. If problem persists please report issue at https://github.com/MKeefeus/Mkeefeus-Multiplaftorm-Media-Manager/issues')
        }            
    },

    //Connect to the same voice channel as the commander
    Connect: function(msg){
        //if bot is connected to same voice channel as user
        if(msg.guild.voice && msg.member.voice.channel && msg.guild.voice.channelID == msg.member.voice.channelID){
            msg.reply("I am already connected")
        }
        //if bot is in a different voice channel 
        else if(msg.guild.voice && msg.guild.voice.channelID && msg.guild.voice.channelID != msg.member.voice.channelID){
            msg.reply("I'm already in "+ msg.guild.voice.channel.name)
        }
        else if(msg.member.voice.channel){
            msg.member.voice.channel.join()
        }
        else if(!msg.member.voice.channel){
            msg.reply("You need to be in a voice channel")
        }
        else{
            msg.channel.send("Unknown error connecting. Please try again. If problem persists please report issue at https://github.com/MKeefeus/Mkeefeus-Multiplaftorm-Media-Manager/issues")
        }
    },

    //Disconnect from voice channel if it has connected once and is currently connected
    Disconnect: function(msg){
        if(msg.guild.voice && msg.guild.voice.channelID && msg.guild.voice.channelID == msg.member.voice.channelID){
            msg.guild.voice.channel.leave()
        }
        else if(!msg.guild.voice || !msg.guild.voice.channelID){
            msg.reply("I'm not currently in a voice channel")
        }
        else if (msg.guild.voice.channelID != msg.member.voice.channelID){
            msg.reply("You must be in my voice channel to use that command")
        }
        else{
            msg.channel.send("Unknown error disconnecting. Please try again. If problem persists please report issue at https://github.com/MKeefeus/Mkeefeus-Multiplaftorm-Media-Manager/issues")
        }
    }
}