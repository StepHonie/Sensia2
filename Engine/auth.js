const db=require("./dbMan");
const ActiveDirectory=require("activedirectory");
const net=require("net");
const ad=new ActiveDirectory({url: "LDAP://corp.jabil.org",
                            baseDN: "dc=corp,dc=jabil,dc=org",
                            attributes: {"user": ["mail"]},
                            username: "svdctu_ctuapp",
                            password: "Jabil#01234"});
function User(o)
{
    Object.defineProperty(this,"username",{configurable: false,value: o.username});
    this.getRole=function(app)
    {
        debugger;
        var roles=JSON.parse(JSON.stringify(o.roles));
        if (app==undefined)
        {
            return roles;
        }
        if (typeof(app)!="string")
        {
            throw {message: "User::getRole can only accept string!"};
        }
        return roles[app] || 0;
    };
    this.addRole=function(app,right)
    {
        if (typeof(app)!="string" || typeof(right)!="number")
        {
            throw {message: "User::addRole can only accept string and number!"};
        }
        var r=o.roles[app] || 0;
        r=r | parseInt(right);
        o.roles[app]=r;
    };
    this.setRole=function(app,right)
    {
        if (typeof(app)!="string" || typeof(right)!="number")
        {
            throw {message: "User::setRole can only accept string and number!"};
        }
        var r=o.roles[app] || 0;
        r=right;
        o.roles[app]=r;
    };
    this.updateLastSignin=function()
    {
        db.getADB().collections("Users").update({"_id": o["_id"]},{$set: {lastSignin: (new Date).getTime()}});
    };
    this.getBasicInformation=function()
    {
        return JSON.parse(JSON.stringify(o.basic));
    };
    this.setBasicInformation=function(field,value)
    {
        if (typeof(field)!="string")
        {
            throw {message: "User::setBasicInformation can only accept string as field!"};
        }
        o.basic[field]=value;
    };
    this.save=function()
    {
        var x=JSON.parse(JSON.stringify(o));
        delete x["_id"];
        db.getADB().collection("Users").update({"_id": o["_id"]},x);
    };
    this.saveRoles=function(appName)
    {
        var x=JSON.parse(JSON.stringify(o));
        x=x.roles[appName];
        if (x==undefined)
        {
            return;
        }
        var v={$set: {}};
        v.$set["roles."+appName]=x;
        db.getADB().collection("Users").update({"_id": o["_id"]},v);
    };
}

function Auth()
{
    var userPattern=/^[a-zA-Z0-9]*$/;
    this.authenticate=function(username,password,callback)
    {
        if (typeof(username)!="string" || typeof(password)!="string" || typeof(callback)!="function")
        {
            throw {message: "Auth::authorize's parameters are string,string,function"};
        }
        if (!userPattern.test(username))
        {
            return process.nextTick(callback,false);
        }
        ad.findUsers("sAMAccountName="+username,function(err,list)
        {
            if (err)
            {
                return process.nextTick(callback,false);
            }
            if (!list || list.length==0)
            {
                return process.nextTick(callback,false);
            }
            username=list[0].mail;
            var vad=new ActiveDirectory({url: "LDAP://corp.jabil.org",
                                        baseDN: "dc=corp,dc=jabil,dc=org",
                                        attributes: {"user": ["*"]},
                                        username: username,
                                        password: password});
            vad.authenticate(username,password,function(err,auth)
            {
                if (err)
                {
                    return process.nextTick(callback,false);
                }
                if (auth)
                {
                    return process.nextTick(callback,true);
                }
                return process.nextTick(callback,false);
            });
        });
    };
    this.getUser=function(username,callback)
    {
        if (typeof(username)!="string" || typeof(callback)!="function")
        {
            throw {message: "Auth::getUser's parameters are string,function"};
        }
        db.getADB().collection("Users").find({username: username.toUpperCase()}).toArray((err,items)=>
        {
            if (err)
            {
                process.nextTick(callback);
            };
            if (items.length==0)
            {
                var u={username: username.toUpperCase(),basic: {},roles: {},lastSignin: 0};
                db.getADB().collection("Users").insert(u);
                process.nextTick(callback,new User(u));
                return;
            }
            var user=new User(items[0]);
            process.nextTick(callback,user);
        });

    };
}


module.exports=new Auth;
