var SensiaPacket=require("./sensiaPacket");


var mlib=new Object;
function Processor(requester,responser)
{
    if (!requester)
    {
        responser.end();
        return;
    }
    var m=requester.getJSON().handler;
    if (mlib[m]==undefined)
    {
        responser.send(new SensiaPacket({error: true,code: 1,content: "Invalid handler name!"}));
        return;
    }
    try
    {
        mlib[m].handle(requester,responser);
    }
    catch (e)
    {
        console.error(e);
    }
}

module.exports={handOver: function(l)
                {
                    mlib=l;
                },
                process: Processor};
