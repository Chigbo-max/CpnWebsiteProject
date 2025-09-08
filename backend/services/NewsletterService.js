const Newsletter = require('../models/Newsletter');
const Subscriber = require('../models/Subscriber');

class INewsletterService {
  sendNewsletter(subject, content) { throw new Error('Not implemented'); }
  static renderNewsletterTemplate({ name, content }) { throw new Error('Not implemented'); }
}

class NewsletterServiceImpl extends INewsletterService {
  constructor(mailer) {
    super();
    this.mailer = mailer;
  }

  static renderNewsletterTemplate({ name, content }) {
    const firstName = name ? name.split(' ')[0] : 'Valued Subscriber';
    return `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; padding: 0; margin: 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8fafc; padding: 0; margin: 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); margin: 32px 0;">
                <tr>
                  <td style="background: #111826ff; border-radius: 10px 10px 0 0; padding: 32px 0; text-align: center;">
                    <h1 style="color: #fff; font-size: 2rem; margin: 0; letter-spacing: 1px;">Christian Professionals Network</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px 40px 0 40px;">
                    <p style="font-size: 1.1rem; color: #222; margin-bottom: 24px;">Dear <b>${firstName}</b>,</p>
                    <div style="font-size: 1.1rem; color: #333; line-height: 1.7; margin-bottom: 32px;">
                      ${content}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 40px 32px 40px;">
                    <p style="font-size: 1rem; color: #444; margin-bottom: 0;">Best regards,</p>
                    <p style="font-size: 1rem; color: #444; margin-top: 4px; font-weight: bold;">Christian Professionals Network Team</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0 16px 0;" />
                    <p style="font-size: 0.95rem; color: #888; text-align: center; margin: 0;">You are receiving this email because you subscribed to Christian Professionals Network updates.</p>
                    <p style="font-size: 0.95rem; color: #888; text-align: center; margin: 0;">&copy; ${new Date().getFullYear()} Christian Professionals Network</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `;
  }

  async sendNewsletter(subject, content) {
    if (!subject || !content) throw new Error('Subject and content are required');

    const subscribers = await Subscriber.find({}, 'email name');
    if (!subscribers.length) throw new Error('No subscribers found');

    // Create a newsletter record
    const newsletter = new Newsletter({
      subject,
      content,
      recipients: subscribers.map(s => s.email),
      status: 'queued'
    });
    await newsletter.save();

    try {
      const emailPromises = subscribers.map(subscriber =>
        this.mailer.sendMail({
          from: process.env.EMAIL_USER,
          to: subscriber.email,
          subject,
          html: NewsletterServiceImpl.renderNewsletterTemplate({ name: subscriber.name, content })
        })
      );
      await Promise.all(emailPromises);

      // Update status after sending
      newsletter.status = 'sent';
      newsletter.sentAt = new Date();
      await newsletter.save();

      return subscribers.length;
    } catch (err) {
      newsletter.status = 'failed';
      await newsletter.save();
      throw err;
    }
  }
}

module.exports = { INewsletterService, NewsletterServiceImpl };
