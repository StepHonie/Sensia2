const dbm=require("./dbMan");
const ObjectId=require("mongodb").ObjectID;
const vm=require("vm");
const mm=require("./moduleManager");
const sdb=dbm.getSDB();



function Lite(o,appData)
{
    this.run=function(param,callback)
    {
        var mod=new Object;
        var context=new vm.Context({mm: mm, param: param, ObjectId: ObjectID,module: mod,appData: appData,moduleLoader: mm,callback: callback});
        var script=new vm.Script("("+o.lite+")(param,appData,moduleLoader,callback)");
        try
        {
            script.runInContext(context,{timeout: 5000});
        }
        catch (e)
        {
            return callback({error: true,errCode: 100,id: gid,content: new Error("Error on looking up lite")});
        }
    };
    this.getProperty=function()
    {
        return o.property;
    };
    this.getName=function()
    {
        return o.name;
    };
}
function LiteManager()
{
    this.addLite=function(lite,o,callback)
    {
        sdb.collection("Lites").insert({lite: lite,info:o},function(err,res)
        {
            if (err)
            {
                return process.nextTick(callback,err);
            }
            process.nextTick(callback,null,res.insertedIds);
        });
    };
    this.removeLite=function(id)
    {
        sdb.collection("Lites").deleteOne({_id: new ObjectId(id)});
    };
    this.listLites=function(callback)
    {
        sdb.collection("Lites").find({},{lite: 0}).toArray(function(err,list)
        {
            if (err)
            {
                return process.nextTick(callback,err);
            }
            process.nextTick(callback,null,list);
        });
    };
    this.getLite=function(id,collections,callback)
    {
        sdb.collection("Lites").find({_id: new ObjectId(id)}).toArray(function(err,list)
        {
            if (err)
            {
                return process.nextTick(callback,err);
            }
            if (list.length==0)
            {
                return process.nextTick(callback,new Error("No Lite Found!"));
            }
            process.nextTick(callback,null,new Lite(list[0],collections));
        });
    };
}
module.exports=LiteManager;
