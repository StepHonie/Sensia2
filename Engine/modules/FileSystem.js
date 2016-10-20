var db=require("./dbMan").getADB;
var fs=require("fs");

function FileSystem()
{
    this.storeFile=function(pid,filename,content,user,callback)
    {
        var date=new Date();
        if(!(pid instanceof Object))
        {
            throw new Error("pid must be an objectId!");
        }
        db.collection("Contents").insert({"content":content,"count":1},function(err,info)
        {
            if(err){return callback(err);};
            db.collection("Files").insert({"content":info.insertedIds,"parent":[pid],"filename":filename,"user":user,;"date":date.getTime()},function(err,info2)
            {
                if(err){return callback(err);};
                callback(null,info.insertedIds);
            });
        });
    };

    this.createFolder=function(pid,foldername,user,callback)
    {
        var date=new Date();
        if(!(pid instanceof Object))
        {
            throw new Error("pid must be an objectId!");
        }
        db.collection("Folder").insert({"parent":[pid],"foldername":[foldername],"user":[user]},function(err,info)
        {
            if(err || info.ok!=1){return callback(err || new Error("createFolder failed!"));};
        });
        callback(null,info.insertedIds.id);
    };

    this.openFile=function(id,callback)
    {
        db.collection("Files").find({"_id":new Object(id)}).toArray(function(err,info)
        {
            if(err || data.length==0)
            {
                 return callback(err || new Object("File not Found!");
            }
            callback(null,info[0]);
        });
    };

    this.listFolder=function(id,callback)
    {
        db.collection("Folder").find({"parent":id}).toArray(function(err,folders)
        {
            if(err || folders.length==0) return callback(err || new Error("This folder is empty"));
            db.collection("Files").find({"parent":id}).toArray(function(err,files)
            {
                if(err){retrun callback(err);}
                callback(null,{files:files,folders:folders});
            });
        });
    };

    this.deleteFile=function(id,callback)
    {
        db.collection('Files').find({"_id":new Object(id)}).toArray(function(err,info)
        {
            if(err || info.length==0){return callback(new Error("Didn't find file!"));};
            var cId=info[0].content;
            db.collection("Files").deleteOne({"_id":new Object(id)},function(err,info)
            {
                if(err) {return callback(err);}
            });
            db.collection("Contents").find({"_id":cId}).toArray(function(err,info)
            {
                if(err || info.length==0){return callback(new Error("Didn't find!"))};
                if(info[0].content==1)
                {
                    db.collection("Contents").deleteOne({"_id":cId},function(err,info)
                    {
                        if(err){return callback(new Error("Deleted failed!"));}
                    }
                }
                else
                {
                    db.collection("Contents").updateOne({"_id":cId},{"$inc":{"count":-1}});
                }
            });
            callback(null);
        });
    };

    this.deleteFolder=function(id)
    {
        process.nextTick(deleteCur(id));
    };

    function deleteCur(id)
    {
        db.collection('Folder').find({"parent":id}).toArray(function(err,list)
        {
            if(err)
            {
                return;
            }
            for (var i=0;i<list.length;i++)
            {
                process.nextTick(deleteCur(list[i]["_id"]));
            }
        });
        db.collection("Folder").deleteOne({_id: new ObjectId(id)});
        db.collection('File').delete({"parent":id});
    }


    this.copyFile=function(hId,pid,filename,user,callback)
    {
        db.collection("Files").find({"_id":hId}).toArray(function(err,docs)
        {
            if (err || docs.length==0) {return callback(new Error("No file found!"));}
            var cId=docs[0].content;
            db.collection("Files").find({"parent": pid,"filename": filename}).toArray(function(err,docs2)
            {
                if(err){return callback(new Error("Unknow Error"));}
                var num=docs2.length;
                if(num>0)
                {
                    return callback(new Error("This file is already exist,pls change a name!"));
                }
                else
                {
                    db.collection("Files").insert({"content":cId,"pid":pid,"filename":filename,"user":user},function(err,info)
                    {
                        if(err)return callback(err);
                        db.collection("Contents").updateOne({"_id": cId},{"$inc": {"count": 1}});
                        callback(null,info.insertedIds);
                    }
                }
            });
        });
    };

    this.copyFolder=function(id,pid,filename,user,callback)
    {
        db.collection("Folder").find({"id":id,"pid":pid,"filename":filename}).toArray(function(err,docs)
        {
            if(err){return callback(new Error("There's th wrong!"));}
            var num=docs.length;
            if(num>0)
            {
                return callback(new Error("This file is already exist,pls change a name!"));
            }
            else
            {
                db.collection("Folder").insert("id":id,"filename":filename,"user":user},function(err,info)
                {});
            }
        });
    };
    module.exports={name:"FileSystem",getConstructor:function(){return FileSystem;};
