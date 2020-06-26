ytdl.getInfo(server.queue[0], (err, info) => {
    if (err) throw err
    msg.channel.send("Playing "+info.title)
})