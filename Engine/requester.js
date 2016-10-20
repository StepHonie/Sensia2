function Requester(packet,socket)
{
    var content=packet.slice(4).toString();
    try
    {
        content=JSON.parse(content);
    }
    catch (e)
    {
        return null;
    }
    this.getJSON=function()
    {
        return content;
    };
}

module.exports=Requester;
