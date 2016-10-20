var fs=require("fs");
var holder=require("./holder");
var mlib=new Object;
function LoadHandlers(fn)
{
    console.log("Loading handlers....");
    fs.readdir("./handlers",function(err,files)
    {
        for (var i=0;i<files.length;i++)
        {
            var o=require("./handlers/"+files[i]);
            console.log("["+o.getName()+"] Loaded.");
            mlib[o.getName()]=o;
        }
        holder.handOver(mlib);
        process.nextTick(fn,holder.process);
    });
}

module.exports={load: function(fn)
                {
                    LoadHandlers(fn);
                }};
