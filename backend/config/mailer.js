const nodemailer = require('nodemailer');

async function createMailer() {
  let transporter;

  try {
    // First try STARTTLS (port 587, secure: false)
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // STARTTLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    });

    // Verify connection
    await transporter.verify();
    console.log("Mailer connected via STARTTLS (587).");
    return transporter;

  } catch (err587) {
    console.warn("Failed on 587, retrying with SSL (465)...", err587.message);

    // Fallback to SSL (port 465, secure: true)
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();
    console.log("Mailer connected via SSL (465).");
    return transporter;
  }
}

module.exports = { createMailer };
