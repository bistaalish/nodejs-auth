// email.js
const nodemailer = require('nodemailer');

var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

module.exports = {
  sendVerificationEmail: async (email, verificationToken) => {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Account Verification',
        html: `Please click <a href="${process.env.APP_URL}/auth/verify/${verificationToken}">here</a> to verify your email.`,
      };
      await transport.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending verification email:', error);
    }
  },
  sendResetPasswordEmail: async (email,token) => {
    try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset',
      html: `Click <a href="${process.env.APP_URL}/auth/forgot-password/${token}">here</a> to reset your password.`,
    };
    await transport.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
  }
};
