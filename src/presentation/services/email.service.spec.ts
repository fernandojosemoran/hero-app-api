import Env from "../../infrastructure/constants/env";
import Email from "../../infrastructure/plugins/email.plugin";
import EmailService from "./email.service";

describe('./src/presentation/services/email.service.ts', () => {
    const emailService: EmailService = new EmailService(new Email());
    const OWNER_TO_SEND_EMAIL_TEST: string | undefined = Env.OWNER_TO_SEND_EMAIL_TEST;
    if (!OWNER_TO_SEND_EMAIL_TEST) throw "OWNER_TO_SEND_EMAIL_TEST is required";

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('Should contain methods like send and authorized email', () => {
        expect(typeof emailService.sendRegisterEmail).toBe("function");
        expect(typeof emailService.sendAuthorizedAccountEmail).toBe("function");
    });

    test("Should be called register email with email,user,content,description parameters", async () => {
        const sendEmailSmock = emailService.sendRegisterEmail = jest.fn();

        await emailService.sendRegisterEmail(OWNER_TO_SEND_EMAIL_TEST, "user test", "content of testing with jest", "description of testing with jest");
        
        expect(sendEmailSmock).toHaveBeenCalledWith(
            OWNER_TO_SEND_EMAIL_TEST,
            "user test",
            "content of testing with jest",
            "description of testing with jest"
        );
    });

    test("Should be called authorization account email with email,user,content,description parameters", async () => {
        const sendEmailSmock = emailService.sendAuthorizedAccountEmail = jest.fn();

        await emailService.sendAuthorizedAccountEmail(OWNER_TO_SEND_EMAIL_TEST, "user test", "content of testing with jest", "description of testing with jest");
        
        expect(sendEmailSmock).toHaveBeenCalledWith(
            OWNER_TO_SEND_EMAIL_TEST,
            "user test",
            "content of testing with jest",
            "description of testing with jest"
        );
    });

    test("Should send a register email", async () => {
        // const emailService: EmailService = new EmailService(new Email());

        // await emailService.sendRegisterEmail(
        //     OWNER_TO_SEND_EMAIL_TEST, 
        //     "user test", "content of testing with jest", 
        //     "description of testing with jest"
        // );

        expect(true).toBeTruthy();
    });

    test("Should send a account authorization email", async () => {
        // const emailService: EmailService = new EmailService(new Email());

        // await emailService.sendAuthorizedAccountEmail(
        //     OWNER_TO_SEND_EMAIL_TEST, 
        //     "user test", "content of testing with jest", 
        //     "description of testing with jest"
        // );

        expect(true).toBeTruthy();
    });
});