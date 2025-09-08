const ContactInquiry = require('../models/ContactInquiry');
const Subscriber = require('../models/Subscriber');

// IContactService interface
class IContactService {
  submitContactForm(data) { throw new Error('Not implemented'); }
  subscribeToNewsletter(data) { throw new Error('Not implemented'); }
}

// ContactServiceImpl implements IContactService
class ContactServiceImpl extends IContactService {
  constructor() {
    super();
  }

  async submitContactForm({ name, email, message }) {
    if (!name || !email || !message) {
      throw new Error('All fields are required');
    }

    const inquiry = new ContactInquiry({
      name,
      email,
      message
    });

    return await inquiry.save();
  }

  async subscribeToNewsletter({ email, name }) {
    if (!email) {
      throw new Error('Email is required');
    }

    // Check if already subscribed
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      throw new Error('Email already subscribed');
    }

    const subscriber = new Subscriber({
      email,
      name
    });

    return await subscriber.save();
  }
}

module.exports = { IContactService, ContactServiceImpl };
