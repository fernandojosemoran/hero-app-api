jest.doMock("./register-email-template", () => {
    const actual = jest.requireActual("./register-email-template").default;
    const registerEmailTemplateMock = jest.fn((user: string, email: string, description: string, content: string) => actual(user, email, description, content));
    return registerEmailTemplateMock;
});

import registerEmailTemplate from "./register-email-template";

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

    test('Should call registerEmailTemplate function with user, email, description, content arguments', () => {
        registerEmailTemplate(arg.user, arg.email, arg.description, arg.content);

        expect(registerEmailTemplate).toHaveBeenCalledWith(arg.user, arg.email, arg.description, arg.content);
    });

    test('Should return a register Email Template the function called registerEmailTemplate', () => {
        const template: string = registerEmailTemplate(arg.user, arg.email, arg.description, arg.content);

        const templateOutput = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Template</title>
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
                        background-color: #007bff; /* Example color */
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
                    .details {
                        margin-bottom: 15px;
                    }
                    .message {
                        margin-bottom: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Email Notification</h1>
                    </div>
                    <div class="content">
                        <div class="greeting">Hello ${arg.user},</div>
                        <div class="details">
                            <p><strong>Email:</strong> ${arg.email}</p>
                            <p><strong>Description:</strong> ${arg.description}</p>
                        </div>
                        <div class="message">
                            ${arg.content}
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