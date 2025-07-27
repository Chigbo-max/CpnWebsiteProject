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
  async enroll({ course, name, email, whatsapp }) {
    const enrollment_id = uuidv4();
    const enrolled_at = new Date();
    // Insert into DB
    const result = await this.db.query(
      'INSERT INTO enrollments (enrollment_id, course, name, email, whatsapp, enrolled_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [enrollment_id, course, name, email, whatsapp, enrolled_at]
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

  // Get enrollment by ID
  async getEnrollmentById(enrollment_id) {
    const result = await this.db.query(
      'SELECT * FROM enrollments WHERE enrollment_id = $1',
      [enrollment_id]
    );
    return result.rows[0] || null;
  }

  // Update enrollment
  async updateEnrollment(enrollment_id, { course, name, email, whatsapp }) {
    const result = await this.db.query(
      'UPDATE enrollments SET course = $1, name = $2, email = $3, whatsapp = $4 WHERE enrollment_id = $5 RETURNING *',
      [course, name, email, whatsapp, enrollment_id]
    );
    return result.rows[0] || null;
  }

  // Delete enrollment
  async deleteEnrollment(enrollment_id) {
    const result = await this.db.query(
      'DELETE FROM enrollments WHERE enrollment_id = $1 RETURNING *',
      [enrollment_id]
    );
    return result.rows[0] || null;
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

  // Get enrollments per month for a given period (default 60 months = 5 years)
  async getMonthlyCounts(months = 60) {
    const result = await this.db.query(`
      SELECT 
        EXTRACT(YEAR FROM enrolled_at) AS year,
        EXTRACT(MONTH FROM enrolled_at) AS month,
        COUNT(*) AS count
      FROM enrollments
      WHERE enrolled_at >= (CURRENT_DATE - INTERVAL '${months} months')
      GROUP BY year, month
      ORDER BY year, month
    `);
    return result.rows;
  }
}

module.exports = EnrollmentService; 