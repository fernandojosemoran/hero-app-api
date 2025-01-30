import nodeMailer from "nodemailer";
import Env from "../../infrastructure/constants/env";
import SMTPTransport from "nodemailer/lib/smtp-transport";

interface ISendEmailParams {
    user: string;
    emailAddress: string;
    htmlTemplate: string;
}

class Email {
    private transport = nodeMailer.createTransport({
        service: Env.MAILER_SERVICE,
        auth: {
            user: Env.MAILER_EMAIL,
            pass: Env.MAILER_SECRET_KEY
        }
    });

    public sendEmail({ user, emailAddress, htmlTemplate }: ISendEmailParams): Promise<SMTPTransport.SentMessageInfo> {
        return this.transport.sendMail({
            to: emailAddress,
            from: "http://heroesApp.vercel",
            html: htmlTemplate,
            subject: user
        });
    }

    // public sendSeverusEmail(users: IUserEmailAddress[]): boolean {
        
    //     return true;
    // };
}

export default Email;