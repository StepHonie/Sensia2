var SensiaPacket=require("../sensiaPacket");
const mm=require("../moduleManager");
const vm=require("vm");
const auth=require("../auth");
const ObjectId=require("mongodb").ObjectID;








module.exports={getName: function(){return "Sensia.superRunner";},
                handle: function(requester,responser)
                {
                    var gid=0;
                    function Callback(res)
                    {
                        var r={content: res,error: false,id: gid};
                        responser.send(new SensiaPacket(r));
                    }
                    var sandbox={console: console,
                                 mm: mm,
                                 ObjectId: ObjectId,
                                 callback: Callback};
                    var content=requester.getJSON();
                    sandbox.param=content.parameters;
                    var script=new vm.Script("("+content.delegation+")(param)");
                    gid=content.id;
                    var context=vm.createContext(sandbox);
                    try
                    {
                        script.runInContext(context,{timeout: 5000});
                    }
                    catch (e)
                    {
                        responser.send(new SensiaPacket({error: true,errCode: 100,id: gid,content: {message: e.message,stack: e.stack}}));
                    }
                }};
