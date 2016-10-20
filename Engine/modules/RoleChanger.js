var auth=require("./auth");


function Changer(user,appName)
{
    this.getRole=function()
    {
        return user.getRole(appName) || 0;
    };
    this.setRole=function(role)
    {
        user.setRole(appName,role);
    };
    this.addRole=function(role)
    {
        user.addRole(appName,role);
    };
    this.save=function()
    {
        user.saveRoles(appName);
    };
}


function RoleChanger(appID)
{
    this.getChanger=function(username,callback)
    {
        database.getSDB().collection("AppList").find({"_id": new ObjectId(appID.toString())}).toArray((err,list)=>
        {
            if (err || list.length==0)
            {
                return callback({message: "APP ID NOT VALID!"});
            }
            auth.getUser(username,function(user)
            {
                if (user)
                {
                    return callback(null,new Changer(user,list[0].name));
                }
                callback({message: "USER NOT FOUND!"});
            });
        });
    };
}


module.exports={name: "RoleChanger",getConstructor: function(){return RoleChanger;}};
