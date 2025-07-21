// ISubscriberService interface
class ISubscriberService {
  getAll() { throw new Error('Not implemented'); }
  create(data) { throw new Error('Not implemented'); }
  update(id, data) { throw new Error('Not implemented'); }
  delete(id) { throw new Error('Not implemented'); }
  findByEmail(email) { throw new Error('Not implemented'); }
  deleteByEmail(email) { throw new Error('Not implemented'); }
}

// SubscriberServiceImpl implements ISubscriberService
class SubscriberServiceImpl extends ISubscriberService {
  constructor(db) {
    super();
    this.db = db;
  }

  async getAll() {
    return (await this.db.query('SELECT * FROM subscribers ORDER BY subscribed_at DESC')).rows;
  }

  async create({ name, email }) {
    const result = await this.db.query('INSERT INTO subscribers (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
    return result.rows[0];
  }

  async update(id, { name, email }) {
    const result = await this.db.query('UPDATE subscribers SET name=$1, email=$2 WHERE id=$3 RETURNING *', [name, email, id]);
    return result.rows[0];
  }

  async delete(id) {
    const result = await this.db.query('DELETE FROM subscribers WHERE id=$1 RETURNING *', [id]);
    return result.rows[0];
  }

  async findByEmail(email) {
    const result = await this.db.query('SELECT * FROM subscribers WHERE email = $1', [email]);
    return result.rows;
  }

  async deleteByEmail(email) {
    const result = await this.db.query('DELETE FROM subscribers WHERE email = $1 RETURNING *', [email]);
    return result.rows[0];
  }

  async getMonthlyCounts() {
    // Returns [{ year: 2024, month: 6, count: 10 }, ...]
    const result = await this.db.query(`
      SELECT 
        EXTRACT(YEAR FROM subscribed_at) AS year,
        EXTRACT(MONTH FROM subscribed_at) AS month,
        COUNT(*) AS count
      FROM subscribers
      WHERE subscribed_at >= (CURRENT_DATE - INTERVAL '12 months')
      GROUP BY year, month
      ORDER BY year, month
    `);
    return result.rows;
  }
}

module.exports = { ISubscriberService, SubscriberServiceImpl }; 