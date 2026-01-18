// Email utility for sending password reset emails using Nodemailer
const nodemailer = require('nodemailer');

const sendPasswordResetEmail = async (email, resetToken, userType) => {
  const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}&type=${userType}`;
  
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log("\n⚠️  EMAIL NOT CONFIGURED - Logging to console instead");
    console.log("\n=== PASSWORD RESET EMAIL ===");
    console.log(`To: ${email}`);
    console.log(`User Type: ${userType}`);
    console.log(`Reset Link: ${resetUrl}`);
    console.log(`Token: ${resetToken}`);
    console.log(`Valid for: 1 hour`);
    console.log("===========================\n");
    console.log("To enable email sending, add EMAIL_USER and EMAIL_PASSWORD to your .env file\n");
    return true;
  }

  try {
    // Create transporter with Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Email HTML template
    const mailOptions = {
      from: `HappyMeal <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - HappyMeal',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(to right, #f97316, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🍽️ HappyMeal</h1>
              <p>Password Reset Request</p>
            </div>
            <div class="content">
              <h2>Hello!</h2>
              <p>You requested to reset your password for your <strong>${userType === 'partner' ? 'Restaurant Partner' : 'Customer'}</strong> account.</p>
              <p>Click the button below to reset your password:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              <p><strong>This link will expire in 1 hour.</strong></p>
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #fff; padding: 10px; border-radius: 5px;">${resetUrl}</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
              <p style="color: #666; font-size: 14px;">If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
            </div>
            <div class="footer">
              <p>© 2026 HappyMeal. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to: ${email}`);
    console.log(`Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    // Fallback to console logging if email fails
    console.log("\n=== PASSWORD RESET EMAIL (Email Failed - Console Fallback) ===");
    console.log(`To: ${email}`);
    console.log(`Reset Link: ${resetUrl}`);
    console.log("===========================\n");
    throw error;
  }
};

module.exports = { sendPasswordResetEmail };
