const Enrollment = require('../models/Enrollment');
const { NewsletterServiceImpl } = require('./NewsletterService');
const { v4: uuidv4 } = require('uuid');




class EnrollmentService {
  constructor(mailer) {
    this.mailer = mailer;
    this.newsletterService = new NewsletterServiceImpl(mailer);
  }

  // Create a new enrollment and send confirmation email
  async enroll({ course, name, email, whatsapp }) {
    if (!course || !name || !email) {
      throw new Error('Course, name, and email are required');
    }

    const enrollment_id = uuidv4();
    const enrolled_at = new Date();

    const enrollment = new Enrollment({
      enrollment_id,
      course,
      name,
      email,
      whatsapp,
      enrolled_at
    });

    const savedEnrollment = await enrollment.save();

    // Send confirmation email
    const content = `
      Thank you for enrolling in <b>${course}</b>!<br>
      Your enrollment ID: <b>${enrollment_id}</b><br>
      Date: <b>${enrolled_at.toLocaleString()}</b>
    `;
    await this.mailer.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Enrollment Confirmation - ${course}`,
      html: NewsletterServiceImpl.renderNewsletterTemplate({ name, content })
    });

    return savedEnrollment;
  }

  // List enrollments, optionally filtered by date range
  async listEnrollments({ startDate, endDate }) {
    const filter = {};
    if (startDate && endDate) {
      filter.enrolled_at = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    return await Enrollment.find(filter).sort({ enrolled_at: -1 });
  }

  // Get enrollment by ID
  async getEnrollmentById(enrollment_id) {
    return await Enrollment.findOne({ enrollment_id });
  }

  // Update enrollment
  async updateEnrollment(enrollment_id, { course, name, email, whatsapp }) {
    return await Enrollment.findOneAndUpdate(
      { enrollment_id },
      { course, name, email, whatsapp },
      { new: true }
    );
  }

  // Delete enrollment
  async deleteEnrollment(enrollment_id) {
    return await Enrollment.findOneAndDelete({ enrollment_id });
  }

  // Send broadcast email to filtered enrollees
  async broadcast({ subject, content, startDate, endDate }) {
    const enrollees = await this.listEnrollments({ startDate, endDate });

    const emailPromises = enrollees.map(enrollee =>
      this.mailer.sendMail({
        from: process.env.EMAIL_USER,
        to: enrollee.email,
        subject,
        html: NewsletterServiceImpl.renderNewsletterTemplate({
          name: enrollee.name,
          content
        })
      })
    );

    await Promise.all(emailPromises);
    return enrollees.length;
  }

  // Get enrollments per month for a given period (default 60 months = 5 years)
  async getMonthlyCounts(months = 60) {
    const sinceDate = new Date();
    sinceDate.setMonth(sinceDate.getMonth() - months);

    const result = await Enrollment.aggregate([
      { $match: { enrolled_at: { $gte: sinceDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$enrolled_at' },
            month: { $month: '$enrolled_at' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Format result similar to Postgres version
    return result.map(r => ({
      year: r._id.year,
      month: r._id.month,
      count: r.count
    }));
  }
}

module.exports = EnrollmentService;
