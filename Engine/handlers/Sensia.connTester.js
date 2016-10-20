var SensiaPacket=require("../sensiaPacket");
const mm=require("../moduleManager");



module.exports={getName: function(){return "Sensia.connTester";},
                handle: function(requester,responser)
                {
                    var v=requester.getJSON();
                    if (typeof(v.v)!="number")
                    {
                        v.v=0;
                    }
                    responser.send(new SensiaPacket({value: v.v^17}));
                }};
