const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    // Create reusable transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail', // you can change this if not using Gmail
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: `"CareerCraft" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    // Send mail
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully');
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
  }
};

module.exports = sendEmail;
