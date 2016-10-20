function OK()
{
    this.ok=function()
    {
        return "OKOKOK"+mm.load("ok2").ok();
    };
}

module.exports={name: "ok",getConstructor: function(){return OK;}};
