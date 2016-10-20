var net=require("tls");
var fs=require("fs");
var conf=fs.readFileSync("./conf.json");
try
{
    conf=JSON.parse(conf.toString());
}
catch (e)
{
    console.log(e);
    process.exit(0);
}
var packetProcessor=function(){};

function ProcessPacket(buff,socket)
{
    if (buff.length<4)
    {
        return buff;
    }
    var plen=buff.readUInt32BE(0);
    if (buff.length<plen)
    {
        return buff;
    }
    var packet=buff.slice(0,plen);
    buff=buff.slice(plen);
    process.nextTick(packetProcessor,packet,socket);
    return new Buffer(0);
}
var server=net.createServer({key: fs.readFileSync("./ca/server.key"),
                             passphrase: "mal321258",
                             cert: fs.readFileSync("./ca/server.crt")},function(socket)
{
    var buff=new Buffer(0);
    socket.on("data",function(chunk)
    {
        buff=Buffer.concat([buff,chunk]);
        buff=ProcessPacket(buff,socket);
    }).on("error",function(err)
    {
        //
    });
});


module.exports={start: function()
                {
                    console.log("Sensia server started at port: "+conf.sensiaPort);
                    server.listen(conf.sensiaPort);
                },
                setPacketProcessor: function(fn)
                {
                    if (typeof(fn)!="function")
                    {
                        throw {message: "setPacketProcessor only accept a function as parameter!"};
                        return;
                    }
                    packetProcessor=fn;
                }};
