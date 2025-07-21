// EnrollmentService.js
const { NewsletterServiceImpl } = require('./NewsletterService');
const { v4: uuidv4 } = require('uuid');

class EnrollmentService {
  constructor(db, mailer) {
    this.db = db;
    this.mailer = mailer;
    this.newsletterService = new NewsletterServiceImpl(db, mailer);
  }

  // Create a new enrollment and send confirmation email
  async enroll({ course, name, email }) {
    const enrollment_id = uuidv4();
    const enrolled_at = new Date();
    // Insert into DB
    const result = await this.db.query(
      'INSERT INTO enrollments (enrollment_id, course, name, email, enrolled_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [enrollment_id, course, name, email, enrolled_at]
    );
    // Send confirmation email
    const content = `Thank you for enrolling in <b>${course}</b>!<br>Your enrollment ID: <b>${enrollment_id}</b><br>Date: <b>${enrolled_at.toLocaleString()}</b>`;
    await this.mailer.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Enrollment Confirmation - ${course}`,
      html: NewsletterServiceImpl.renderNewsletterTemplate({ name, content })
    });
    return result.rows[0];
  }

  // List enrollments, optionally filtered by date range
  async listEnrollments({ startDate, endDate }) {
    let query = 'SELECT * FROM enrollments';
    const params = [];
    if (startDate && endDate) {
      query += ' WHERE enrolled_at BETWEEN $1 AND $2';
      params.push(startDate, endDate);
    }
    query += ' ORDER BY enrolled_at DESC';
    const result = await this.db.query(query, params);
    return result.rows;
  }

  // Send broadcast email to filtered enrollees
  async broadcast({ subject, content, startDate, endDate }) {
    const enrollees = await this.listEnrollments({ startDate, endDate });
    const emailPromises = enrollees.map(enrollee =>
      this.mailer.sendMail({
        from: process.env.EMAIL_USER,
        to: enrollee.email,
        subject,
        html: NewsletterServiceImpl.renderNewsletterTemplate({ name: enrollee.name, content })
      })
    );
    await Promise.all(emailPromises);
    return enrollees.length;
  }
}

module.exports = EnrollmentService; 