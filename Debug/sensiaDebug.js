var net=require("tls");
function A()
{
    mm.load("JabilMailSender").sendMail("Thrasky_Lou@jabil.com","SENSIA2@Jabil.com","JJJ","LKSJDLFKJ");
    Callback("SDLKFJ");
}

var socket=net.connect({host: "10.128.100.107",port: 5521,rejectUnauthorized: false},function()
{
    var buff=new Buffer(4);
    var content=new Buffer(JSON.stringify({handler: "Sensia.superRunner",delegation: A.toString()}));
    buff.writeUInt32BE(4+content.length,0);
    socket.write(Buffer.concat([buff,content]));
    socket.on("data",function(chunk)
    {
        console.log(chunk.toString());
    });
});
