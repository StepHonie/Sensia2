var dbm=require("./dbMan");
var ObjectId=require("mongodb").ObjectID;
var sdb=dbm.getSDB();

function AppDataManager()
{
    this.getCollection=function(ckey,callback)
    {
        sdb.collection("AppDataList").find({_id: new ObjectId(ckey)}).toArray(function(err,list)
        {
            if (err)
            {
                return process.nextTick(callback,err);
            }
            if (list.length==0)
            {
                return process.nextTick(callback,new Error("Invalid Collection Key!"));
            }
            process.nextTick(callback,null,dbm.getLDB().collection(list[0].name));
        });
    };
    this.listAppCollections=function(appName,callback)
    {
        var condition={};
        if (typeof(appName)=="string")
        {
            condition.application=appName;
        }
        sdb.collection("AppDataList").find(condition).toArray(function(err,list)
        {
            if (err)
            {
                return process.nextTick(callback,err);
            }
            process.nextTick(callback,null,list);
        });
    };
    this.addAppCollection=function(appName,cname,property,callback)
    {
        sdb.collection("AppDataList").insert({application: appName,name: cname,property: property},function(err,res)
        {
            if (err)
            {
                return process.nextTick(callback,err);
            }
            process.nextTick(callback,null,res.insertedIds);
        });
    };
    this.removeAppCollectionByAppName=function(appName)
    {
        sdb.collection("AppDataList").deleteMany({application: appName});
    };
    this.removeAppCollectionByCKey=function(ckey)
    {
        sdb.collection("AppDataList").deleteOne({_id: new ObjectId(ckey)});
    };
}


module.exports=AppDataManager;
