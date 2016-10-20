var dbm=require("./dbMan");
var LiteManager=require("./LiteManager");


function LiteManagerProvider(appID)
{
    this.getNewInstance=function()
    {
        dbm.getSDB().collection("AppList").find({_id: new ObjectId(appID)}).toArray(function(err,list)
        {
            if (err)
            {
                return process.nextTick(callback,err);
            }
            if (list.length==0)
            {
                return process.nextTick(callback,new Error("Application ID is invalid!"));
            }
            if (!list[0].isSuperApp)
            {
                return process.nextTick(callback,new Error("This application is not a super application!"));
            }
            process.nextTick(callback,null,new Litemanager);
        });
    };
}

module.exports={name: "LiteManagerProvider",getConstructor: function(){return LiteManagerProvider;}};
