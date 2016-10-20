var auth=require("./auth");


function AccountAuthenticator()
{
    this.authenticate=function(user,pass,callback)
    {
        auth.authenticate(user,pass,function(res)
        {
            callback(res);
        });
    };
}

module.exports={name: "AccountAuthenticator",getConstructor: function(){return AccountAuthenticator;}};
