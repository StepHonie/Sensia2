var SensiaPacket=require("./sensiaPacket");


function Responser(socket)
{
    this.send=function(spack)
    {
        if (!(spack instanceof SensiaPacket))
        {
            throw {message: "Responser.send() can only receive SensiaPacket as parameter!"};
            return;
        }
        socket.write(spack.getBuffer());
    };
    this.end=function()
    {
        try
        {
            socket.end();
        }
        catch (e)
        {
            //
        }
    };
}

module.exports=Responser;
