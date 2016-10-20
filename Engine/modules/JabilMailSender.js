var nodemailer=require('nodemailer');
function MailSender()
{
    this.sendMail=function(address,source,subject,content,callback)
    {
        if (typeof(callback)!="function")
        {
            callback=function(){};
        }
        var trans=nodemailer.createTransport({ignoreTLS: true,
                                              host: "corimc04",
                                              secureConnection: false});
        trans.sendMail({from: source,
                        to: address,
                        subject: subject,
                        html: content},
                        function(error,response)
                        {
                            callback(error,response);
                            trans.close();
                        });
    };
}
module.exports={name: "JabilMailSender",getConstructor: function(){return MailSender;}};
