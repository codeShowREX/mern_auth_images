export const WELCOME_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9f9f9; color: #333333; line-height: 1.5;">
    <!-- Main Container -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <tr>
            <td style="padding: 0;">
                <!-- Header -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                        <td style="padding: 32px 24px; text-align: center; background-color: #7AC142; color: #ffffff;">
                            <h1 style="margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">Welcome to Mern-Auth Services</h1>
                        </td>
                    </tr>
                </table>
                
                <!-- Content -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                        <td style="padding: 32px 24px;">
                            <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #333333;">Hello, {name}!</h2>
                            
                            <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5; color: #333333;">
                                Thank you for choosing <strong>Team Mern-Auth Services</strong>. We're excited to have you on board!
                            </p>
                            
                            <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5; color: #333333;">
                                Your account has been successfully created. To get started, click the button below to visit our website.
                            </p>
                            
                            <!-- CTA Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                                <tr>
                                    <td style="background-color: #7AC142; border-radius: 4px; text-align: center;">
                                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="display: inline-block; padding: 14px 32px; font-size: 16px; color: #ffffff; text-decoration: none; font-weight: 600; border-radius: 4px;">Get Started</a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 24px 0 0; font-size: 16px; line-height: 1.5; color: #333333;">
                                If you need any assistance, please don't hesitate to contact our support team.
                            </p>
                            
                            <p style="margin: 24px 0 0; font-size: 16px; line-height: 1.5; color: #333333;">
                                We hope you enjoy using our services as much as we enjoy providing them to you.
                            </p>
                            
                            <p style="margin: 24px 0 0; font-size: 16px; line-height: 1.5; color: #333333;">
                                Best regards,<br>
                                The Mern-Auth Services Team
                            </p>
                        </td>
                    </tr>
                </table>
                
                <!-- Footer -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f9f9f9;">
                    <tr>
                        <td style="padding: 24px; text-align: center; color: #999999; font-size: 12px; border-top: 1px solid #eeeeee;">
                            <p style="margin: 0 0 8px;">© 2025 Mern-Auth Services. All rights reserved.</p>
                            <p style="margin: 0 0 16px;">
                                <a href="#" style="color: #7AC142; text-decoration: none; margin: 0 8px;">Privacy Policy</a> | 
                                <a href="#" style="color: #7AC142; text-decoration: none; margin: 0 8px;">Terms of Service</a>
                            </p>
                            <p style="margin: 0;">
                                <a href="#" style="color: #7AC142; text-decoration: none;">Unsubscribe</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Verify Your Email</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Thank you for signing up! Your verification code is:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">{verificationCode}</span>
    </div>
    <p>Enter this code on the verification page to complete your registration.</p>
    <p>This code will expire in 15 minutes for security reasons.</p>
    <p>If you didn't create an account with us, please ignore this email.</p>
    <p>Best regards,<br>Mern-Auth Services Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>If you did not initiate this password reset, please contact our support team immediately.</p>
    <p>For security reasons, we recommend that you:</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Enable two-factor authentication if available</li>
      <li>Avoid using the same password across multiple sites</li>
    </ul>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>Mern-Auth Services Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
    <p>To reset your password, click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
    </div>
    <p>This link will expire in 1 hour for security reasons.</p>
    <p>Best regards,<br>Mern-Auth Services Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;
