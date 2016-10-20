var auth=require("./auth");
var dbm=require("./dbMan");


function CollectionHunter(appID)
{
    this.getCollections=function(callback)
    {
        dbm.getSDB().collection("DataMap").find({appID: new ObjectId(appID)}).toArray(function(err,list)
        {
            if (err)
            {
                return callback(new Error("Invalid application ID"));
            }
            if (list.length==0)
            {
                return callback(new Error("No datamap found!"));
            }
            var map=list[0];
            var o=new Object;
            for (var i=0;i<map.cols.length;i++)
            {
                o[map.cols[i].name]=dbm.getLDB().collection(map.cols[i].colName);
            }
            callback(null,o);
        });
    };
    this.getCollectionInfo=function(callback)
    {
        dbm.getSDB().collection("DataMap").find({appID: new ObjectId(appID)}).toArray(function(err,list)
        {
            if (err)
            {
                return callback(new Error("Invalid application ID"));
            }
            if (list.length==0)
            {
                return callback(new Error("No datamap found"));
            }
            list=list[0];
            for (var i=0;i<list.cols.length;i++)
            {
                list.cols[i].colName=undefined;
            }
            callback(null,list);
        });
    };
    this.createCollectionInfoIfNotExists=function(callback)
    {
        dbm.getSDB().collection("DataMap").find({appID: new ObjectId(appID)}).toArray(function(err,list)
        {
            if (err)
            {
                return callback(new Error(err.message));
            }
            if (list.length==0)
            {
                dbm.getSDB().collection("DataMap").insert({appID: new ObjectId(appID),cols: []});
                return callback(null);
            }
        });
    };
    this.remove=function()
    {
        dbm.getSDB().collection("DataMap").deleteOne({appID: new ObjectId(appID)});
    };

}

module.exports={name: "CollectionHunter",getConstructor: function(){return CollectionHunter;}};
