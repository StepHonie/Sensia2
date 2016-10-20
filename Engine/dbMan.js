var fs=require("fs");
var client=require("mongodb").MongoClient;

var conf=fs.readFileSync("conf.json");
try
{
    conf=JSON.parse(conf.toString());
}
catch (e)
{
    console.log(e);
    process.exit(0);
}
var dbm=new Object;
dbm.init=function()
{
    client.connect("mongodb://"+conf.localDB.addr,function(err,db)
    {
        if (err)
        {
            console.log(err);
            process.exit(0);
        }
        client.connect("mongodb://"+conf.authDB.addr,function(err,adb)
        {
            if (err)
            {
                console.log(err);
                process.exit(0);
            }
            client.connect("mongodb://"+conf.sysDB.addr,function(err,sdb)
            {
                if (err)
                {
                    console.log(err);
                    process.exit(0);
                }
                dbm.getADB=function()
                {
                    return adb;
                };
                dbm.getLDB=function()
                {
                    return db;
                };
                dbm.getSDB=function()
                {
                    return sdb;
                };
                process.nextTick(dbm.onload);
            });
        });
    });
};
dbm.onload=function(){};

module.exports=dbm;
