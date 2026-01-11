const nodemailer = require('nodemailer');

/**
 * sendEmail Utility Function
 * @param {string} to - Recipient email address
 * @param {string} subject - Subject line
 * @param {string} text - Plain text body
 * @returns {Promise<void>}
 */
const sendEmail = async (to, subject, text) => {
  try {
    // Create reusable transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,  // your Gmail address
        pass: process.env.EMAIL_PASS,  // your App Password
      },
    });

    // Email options
    const mailOptions = {
      from: `"CareerCraft" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${to}`);
  } catch (error) {
    console.error(`❌ Email send failed: ${error.message}`);
  }
};

module.exports = sendEmail;
