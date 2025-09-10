const ContactInquiry = require('../models/ContactInquiry');

class IInquiryService {
  getAll() { throw new Error('Not implemented'); }
  updateStatus(id, status) { throw new Error('Not implemented'); }
  respond(id, admin_response) { throw new Error('Not implemented'); }
  delete(id) { throw new Error('Not implemented'); }
}

class InquiryServiceImpl extends IInquiryService {
  constructor() {
    super();
  }

  // Get all inquiries sorted by latest first
  async getAll() {
    return await ContactInquiry.find().sort({ createdAt: -1 });
  }

  // Update only the status
  async updateStatus(id, status) {
    return await ContactInquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
  }

  // Respond with admin message + mark as responded
  async respond(id, admin_response) {
    return await ContactInquiry.findByIdAndUpdate(
      id,
      {
        admin_response,
        status: 'responded',
        responded_at: new Date()
      },
      { new: true }
    );
  }

  // Delete inquiry
  async delete(id) {
    return await ContactInquiry.findByIdAndDelete(id);
  }
}

module.exports = { IInquiryService, InquiryServiceImpl };
