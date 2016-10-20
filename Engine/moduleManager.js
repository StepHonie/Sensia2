var library=new Object;
var fs=require("fs");
const vm=require("vm");
const dbm=require("./dbMan");
const Mongo=require("mongodb");

function ProcessShell()
{
    this.nextTick=function()
    {
        process.nextTick(process,arguments);
    };
}


function ModuleManager()
{
    this.load=function(mname,keycode)
    {
        if (typeof(library[mname])!="function")
        {
            try
            {
                return this.forceLoad(mname,keycode);
            }
            catch (e)
            {
                throw e;
            }
        }
        var o=new library[mname](keycode);
        return o;
    };
    this.forceLoad=function(mname,keycode)
    {
        var mod=new Object;
        var code;
        try
        {
            code=fs.readFileSync("./modules/"+mname+".js");
        }
        catch (e)
        {
            var x=new Error;
            x.message="Can't find module["+mname+"].";
            throw x;
        }
        code=new vm.Script(code);
        var sandbox={ObjectId: Mongo.ObjectID,database: dbm,mm: new ModuleManager,module: null,require: require,console: console,process: new ProcessShell};
        sandbox.module=mod;
        var context=vm.createContext(sandbox);
        try
        {
            code.runInContext(context,{timeout: 5000});
            library[mod.exports.name]=mod.exports.getConstructor();
        }
        catch (e)
        {
            throw e;
        }
        var o=new library[mname](keycode);
        return o;
    }
}



module.exports=new ModuleManager;
