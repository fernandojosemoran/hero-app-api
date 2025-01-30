import SMTPTransport from "nodemailer/lib/smtp-transport";
import Email from "../../infrastructure/plugins/email.plugin";
import registerEmailTemplate from "../../infrastructure/constants/email/register-email-template";
import authorizedAccountEmailTemplate from "../../infrastructure/constants/email/authorized-account-email-template";

class EmailService {
    public constructor(
        private readonly _email: Email
    ) {}

    public sendRegisterEmail(emailAddress: string, user: string, content: string, description: string): Promise<SMTPTransport.SentMessageInfo> {
        return this._email.sendEmail({ 
            user,  
            emailAddress, 
            htmlTemplate: registerEmailTemplate(user, emailAddress, description,content) 
        });
    }

    public sendAuthorizedAccountEmail(emailAddress: string, user: string, content: string, description: string): Promise<SMTPTransport.SentMessageInfo> { 
        return this._email.sendEmail({ 
            user,  
            emailAddress, 
            htmlTemplate: authorizedAccountEmailTemplate(user, emailAddress, description,content) 
        });
    }
}

export default EmailService;