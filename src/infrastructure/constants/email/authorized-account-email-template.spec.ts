jest.doMock("./authorized-account-email-template", () => {
    const actual = jest.requireActual("./authorized-account-email-template").default;
    const registerEmailTemplateMock = jest.fn((user: string, email: string) => actual(user, email));
    return registerEmailTemplateMock;
});

import authorizedAccountEmailTemplate from "./authorized-account-email-template";

interface IRegisterEmailTemplateArguments {
    user: string;
    email: string;
    description: string;
    content: string;
}

function normalizeWhitespace(str: string): string {
    return str.replace(/\s+/g, ' ').trim();
}

describe('./src/infrastructure/constants/email/register-email-template.ts', () => {
    const arg: IRegisterEmailTemplateArguments = {
        user: "test-user",
        email: "test@gmail.com",
        content: "test-content",
        description: "test-description"
    };

    test('Should call authorizedAccountEmailTemplate function with user, email arguments', () => {
        authorizedAccountEmailTemplate(arg.user, arg.email);

        expect(authorizedAccountEmailTemplate).toHaveBeenCalledWith(arg.user, arg.email);
    });

    test('Should return a authorization Email Template the function called authorizedAccountEmailTemplate', () => {
        const template: string = authorizedAccountEmailTemplate(arg.user, arg.email);

        const templateOutput = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Account Authorized</title>
                <style>
                    body {
                        font-family: sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 600px;
                        margin: 20px auto;
                        background-color: #ffffff;
                        border-radius: 8px;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background-color: #28a745; /* Green color for authorization */
                        color: #ffffff;
                        padding: 20px;
                        text-align: center;
                        border-top-left-radius: 8px;
                        border-top-right-radius: 8px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .footer {
                        background-color: #f0f0f0;
                        padding: 10px;
                        text-align: center;
                        border-bottom-left-radius: 8px;
                        border-bottom-right-radius: 8px;
                        font-size: 12px;
                    }
                    .greeting {
                        font-weight: bold;
                        margin-bottom: 10px;
                    }
                    .message {
                        margin-bottom: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Account Authorized</h1>
                    </div>
                    <div class="content">
                        <div class="greeting">Hello ${arg.user},</div>

                        <div class="message">
                            Your account has been successfully authorized.
                        </div>
                    </div>
                    <div class="footer">
                        This is an automated email. Please do not reply.
                    </div>
                </div>
            </body>
            </html>
        `;

        expect(normalizeWhitespace(template)).toBe(normalizeWhitespace(templateOutput));
    });
});