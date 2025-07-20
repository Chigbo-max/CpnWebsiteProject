// IContactService interface
class IContactService {
  submitContactForm(data) { throw new Error('Not implemented'); }
  subscribeToNewsletter(data) { throw new Error('Not implemented'); }
}

// ContactServiceImpl implements IContactService
class ContactServiceImpl extends IContactService {
  constructor(db) {
    super();
    this.db = db;
  }

  async submitContactForm({ name, email, message }) {
    if (!name || !email || !message) {
      throw new Error('All fields are required');
    }
    const result = await this.db.query(
      'INSERT INTO contact_inquiries (name, email, message) VALUES ($1, $2, $3) RETURNING *',
      [name, email, message]
    );
    return result.rows[0];
  }

  async subscribeToNewsletter({ email, name }) {
    if (!email) {
      throw new Error('Email is required');
    }
    // Check if already subscribed
    const existing = await this.db.query(
      'SELECT * FROM subscribers WHERE email = $1',
      [email]
    );
    if (existing.rows.length > 0) {
      throw new Error('Email already subscribed');
    }
    const result = await this.db.query(
      'INSERT INTO subscribers (email, name) VALUES ($1, $2) RETURNING *',
      [email, name]
    );
    return result.rows[0];
  }
}

module.exports = { IContactService, ContactServiceImpl }; 