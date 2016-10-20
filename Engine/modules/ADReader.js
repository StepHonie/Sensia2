const ActiveDirectory=require("activedirectory");
const ad=new ActiveDirectory({url: "LDAP://corp.jabil.org",
                            baseDN: "dc=corp,dc=jabil,dc=org",
                            attributes: {"user": ["title",
                                                  "telephoneNumber",
                                                  "displayName",
                                                  "department",
                                                  "company",
                                                  "mailNickName",
                                                  "employeeNumber",
                                                  "employeeType",
                                                  "name",
                                                  "employeeID",
                                                  "sAMAccountName",
                                                  "accountExpires",
                                                  "division",
                                                  "userPrincipalName",
                                                  "mail",
                                                  "manager"]},
                            username: "svdctu_ctuapp",
                            password: "Jabil#01234"});
function ADReader()
{
    this.getFromAD=function(filter,callback)
    {
        ad.findUsers(filter,function(err,list)
        {
            if (err)
            {
                return callback(new Error("AD ERROR"),null);
            }
            return callback(undefined,list);
        });
    };
}
module.exports={name: "ADReader",getConstructor: function(){return ADReader;}};
