// IInquiryService interface
class IInquiryService {
  getAll() { throw new Error('Not implemented'); }
  updateStatus(id, status) { throw new Error('Not implemented'); }
  respond(id, admin_response) { throw new Error('Not implemented'); }
  delete(id) { throw new Error('Not implemented'); }
}

// InquiryServiceImpl implements IInquiryService
class InquiryServiceImpl extends IInquiryService {
  constructor(db) {
    super();
    this.db = db;
  }

  async getAll() {
    return (await this.db.query('SELECT * FROM contact_inquiries ORDER BY created_at DESC')).rows;
  }

  async updateStatus(id, status) {
    const result = await this.db.query('UPDATE contact_inquiries SET status=$1 WHERE id=$2 RETURNING *', [status, id]);
    return result.rows[0];
  }

  async respond(id, admin_response) {
    const result = await this.db.query('UPDATE contact_inquiries SET admin_response=$1, status=$2, responded_at=CURRENT_TIMESTAMP WHERE id=$3 RETURNING *', [admin_response, 'responded', id]);
    return result.rows[0];
  }

  async delete(id) {
    const result = await this.db.query('DELETE FROM contact_inquiries WHERE id=$1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = { IInquiryService, InquiryServiceImpl }; 