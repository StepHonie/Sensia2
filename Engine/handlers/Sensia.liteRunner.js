var SensiaPacket=require("../sensiaPacket");
const mm=require("../moduleManager");
const lm=require("../liteManager");



module.exports={getName: function(){return "Sensia.liteRunner";},
                handle: function(requester,responser)
                {
                    var gid=0;
                    function Callback(res)
                    {
                        var r={content: res,error: false,id: gid};
                        responser.send(new SensiaPacket(r));
                    }
                    var content=requester.getJSON();
                    lm.getLite(content.liteID,content.cKey,function(err,lite)
                    {
                        if (err)
                        {
                            return responser.send(new SensiaPacket({error: true,errCode: 100,id: gid,content: new Error("Error on looking up lite")}));
                        }
                        lite.run(content.parameters,callback);
                    });
                }};
