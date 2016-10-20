import jcifs.smb.NtlmPasswordAuthentication;
import jcifs.smb.SmbFile;
import org.json.JSONObject;

import java.io.InputStream;
import java.net.ServerSocket;
import java.net.Socket;

public class Main
{
    public static void main(String args[])
    {
        System.setProperty("jcifs.smb.client.dfs.disabled", "true");
        System.out.println("GasTank on!");
        try
        {
            ServerSocket server=new ServerSocket(5522);
            while (true)
            {
                byte[] buffer=new byte[128];
                Socket socket=server.accept();
                try
                {
                    InputStream is=socket.getInputStream();
                    is.read(buffer,0,128);
                    String json=new String(buffer,"UTF-8");
                    JSONObject o=new JSONObject(json);
                    NtlmPasswordAuthentication auth=new NtlmPasswordAuthentication("JABIL",o.getString("username"),o.getString("password"));
                    SmbFile file=new SmbFile("smb://cnctug0as01/ChopsBrain-"+o.getString("group")+"/Auth.txt",auth);
                    InputStream os=file.getInputStream();
                    os.close();
                    byte[] r={1};
                    socket.getOutputStream().write(r);
                    socket.getOutputStream().close();
                    socket.close();
                }
                catch (Exception e)
                {
                    byte[] r={0};
                    try
                    {
                        socket.getOutputStream().write(r);
                        socket.getOutputStream().close();
                        socket.close();
                    }
                    catch (Exception ex)
                    {
                        //
                    }
                }
            }
        }
        catch (Exception exc)
        {
            //
        }
    }
}