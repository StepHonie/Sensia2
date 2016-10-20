var auth=require("./auth");
function User(u)
{
    this.getBasicInformation=function(){return u.getBasicInformation();};
    this.updateLastSignin=function(){return u.updateLastSignin();};
    Object.defineProperty(this,"username",{configurable: false,value: u.username});
}
function UserModule()
{
    this.getUser=function(username,callback)
    {
        auth.getUser(username,function(user)
        {
            if(user)
            {
                callback(new User(user));
            }
            else
            {
                callback(null);
            }
        });
    };
}
module.exports={name:"UserFinder",getConstructor: function(){return UserModule;}};
