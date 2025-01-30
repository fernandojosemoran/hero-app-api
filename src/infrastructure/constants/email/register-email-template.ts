function registerEmailTemplate(user: string, email: string, description: string, content: string): string {
    return `
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
            <div class="greeting">Hello ${user},</div>

            <div class="details">
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Description:</strong> ${description}</p>
            </div>

            <div class="message">
                ${content}
            </div>
        </div>
        <div class="footer">
            This is an automated email. Please do not reply.
        </div>
    </div>
</body>
</html>
    `;
}

export default registerEmailTemplate;