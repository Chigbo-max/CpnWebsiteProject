const nodemailer = require('nodemailer');

async function createMailer() {
  let transporter;

  // Try STARTTLS first
  try {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    if (process.env.NODE_ENV !== 'test') {
      await transporter.verify();
      console.log("Mailer connected via STARTTLS (587). ✅");
    }

    return transporter;

  } catch (err587) {
    console.warn("Failed on 587, retrying with SSL (465)...", err587.message);

    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    if (process.env.NODE_ENV !== 'test') {
      await transporter.verify();
      console.log("Mailer connected via SSL (465). ✅");
    }

    return transporter;
  }
}

module.exports = { createMailer };
