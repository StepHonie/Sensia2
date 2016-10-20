var auth=require("./auth");
var dbm=require("./dbMan");


function SharedCollectionHunter(appID)
{
    this.getCollections=function(callback)
    {
        dbm.getSDB().collection("DataMap").find({_id: new ObjectId(appID)}).toArray(function(err,list)
        {
            if (err)
            {
                return callback(new Error("Invalid share ID"));
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
}

module.exports={name: "SharedCollectionHunter",getConstructor: function(){return SharedCollectionHunter;}};
