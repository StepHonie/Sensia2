function SensiaPacket(json)
{
    var buff=new Buffer(4);
    var content=new Buffer(JSON.stringify(json));
    buff.writeUInt32BE(content.length+4,0);
    var packet=Buffer.concat([buff,content]);
    this.getBuffer=function()
    {
        return packet;
    };
    this.getJSON=function()
    {
        return json;
    };
    this.toString=function()
    {
        return JSON.stringify(json);
    };
}


module.exports=SensiaPacket;
