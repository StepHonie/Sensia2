var dbm=require("./dbMan");
var server=require("./server");
var handlers=require("./hloader");
var Requester=require("./requester");
var Responser=require("./responser");




console.log("Sensia2 starting....");
console.log("Connecting to database");
dbm.onload=function()
{
    console.log("Database connected!");
    handlers.load(function(hprocessor)
    {
        server.setPacketProcessor(function(packet,socket)
        {
            var responser=new Responser(socket);
            var requester=new Requester(packet,socket);
            hprocessor(requester,responser);
        });
        server.start();
    });
};
dbm.init();


process.on("uncaughtException",function(e)
{
    console.error(e.stack);
});
