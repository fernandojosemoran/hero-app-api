import Email from "./email.plugin";
import Env from "../../infrastructure/constants/env";

const sendEmailMock = jest.fn();

jest.mock("nodemailer", () => {
    const actualNodeMailer = jest.requireActual("nodemailer");

    const nodeMailerMock = {
        ...actualNodeMailer,
        createTransport: jest.fn(() => ({
            sendMail: sendEmailMock,
        })),
    };

    return nodeMailerMock;
});

import nodeMailer from "nodemailer";

interface IEmailOptions { 
    user: string, 
    emailAddress: string, 
    htmlTemplate: string 
};

interface INodeMailerOptions {
    service: string;
    auth: {
        user: string;
        pass: string;
    }
}

describe('./src/infrastructure/plugins/email.plugin.ts', () => {
    let emailPlugin: Email;

    const emailOptions: IEmailOptions = {
        user: "test user",
        emailAddress: "test@example.com",
        htmlTemplate: "<p>Test email</p>",
    };

    const nodeMailerOptions: INodeMailerOptions = {
        service: Env.MAILER_SERVICE,
        auth: {
            user: Env.MAILER_EMAIL,
            pass: Env.MAILER_SECRET_KEY
        }
    };

    beforeEach(() => {
        // jest.resetAllMocks();
        emailPlugin = new Email();
    });
    
    test('Should have properties like sendEmail', () => {
        expect(emailPlugin).toHaveProperty("sendEmail");
    });

    test('Should have sendEmail property as method', () => {
        expect(typeof emailPlugin.sendEmail).toBe("function");
    });

    test('Should have sendEmail property as method', async () => {
        const sendEmailSpy = jest.spyOn(emailPlugin, "sendEmail").mockImplementation(jest.fn());

        await emailPlugin.sendEmail(emailOptions);

        expect(sendEmailSpy).toHaveBeenCalledWith(emailOptions);
    });

    test("Should call createTestAccount with nodemailer options", async () => {    
        await emailPlugin.sendEmail(emailOptions);
    
        expect(nodeMailer.createTransport).toHaveBeenCalledWith(nodeMailerOptions);
    });

    test("Should call nodeMailer.createTransport.sendEmail method with user, email, and htmlTemplate arguments", async () => {
        jest.resetAllMocks();
        jest.resetModules();
        
        await emailPlugin.sendEmail(emailOptions);
    
        expect(sendEmailMock).toHaveBeenCalledWith({
            to: emailOptions.emailAddress,
            from: "http://heroesApp.vercel",
            html: emailOptions.htmlTemplate,
            subject: emailOptions.user
        });
    });
});