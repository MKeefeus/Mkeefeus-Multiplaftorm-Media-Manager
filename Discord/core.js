module.exports = {
    Help: function(msg){
        msg.reply("\n"+
        "Delete [number of messages]: Deletes the given number of messages from the chat\n"
        +"Connect: Connects bot to the voice channel you are in\n"
        +"Disconnect: Disconnects the bot from the voice channel")
    },

    Delete: function(msg, args){
        if(!args[1]){
            return msg.reply('Error: need number of messages')
        }
        msg.channel.bulkDelete(args[1])      
    },

    Connect: function(msg){
        if(msg.member.voice.channel){
            msg.member.voice.channel.join()
        }
        else{
            msg.reply("You need to be in a voice channel")
        }
    },

    Disconnect: function(msg){
        if(msg.member.voice.channel){
            msg.member.voice.channel.leave()
        }
    }
}