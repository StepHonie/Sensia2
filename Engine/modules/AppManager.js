var dbm=require("./dbMan");


function AppManager()
{
    this.listApps=function(callback)
    {
        dbm.getSDB().collection("AppList").find().toArray(function(err,list)
        {
            if (err)
            {
                return callback(err);
            }
            callback(null,list);
        });
    };
    this.getAppByName=function(appName,callback)
    {
        dbm.getSDB().collection("AppList").find({name: appName}).toArray(function(err,list)
        {
            if (err)
            {
                return callback(new Error(err.message));
            }
            if (list.length==0)
            {
                return callback(null,null);
            }
            return callback(null,list[0]);
        });
    };
    this.getAppById=function(appId,callback)
    {
        dbm.getSDB().collection("AppList").find({_id: appId}).toArray(function(err,list)
        {
            if (err)
            {
                return callback(new Error(err.message));
            }
            if (list.length==0)
            {
                return callback(null,null);
            }
            return callback(null,list[0]);
        });
    };
    this.listAppsByOwner=function(user,callback)
    {
        dbm.getSDB().collection("AppList").find({owner: user}).toArray(function(err,list)
        {
            if (err)
            {
                return callback(err);
            }
            callback(null,list);
        });
    };
    this.createApp=function(o)
    {
        dbm.getSDB().collection("AppList").insert(o);
        return o._id.toString();
    };
    this.removeApp=function(appID)
    {
        dbm.getSDB().collection("AppList").deleteOne({_id: new ObjectId(appID)});
    };
}






function AppManagerShell(appID)
{
    this.getNewInstance=function(callback)
    {
        dbm.getSDB().collection("AppList").find({_id: new ObjectId(appID)}).toArray(function(err,list)
        {
            if (err)
            {
                return callback(err);
            }
            if (list.length==0)
            {
                return callback(new Error("Application ID is invalid!"));
            }
            if (!list[0].isSuperApp)
            {
                return callback(new Error("This application is not a super application!"));
            }
            callback(null,new AppManager);
        });
    };
}


module.exports={name: "AppManager",getConstructor: function(){return AppManagerShell;}};
