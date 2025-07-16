class AdminService {
  constructor(db) {
    this.db = db;
  }

  async getAll() {
    return (await this.db.query('SELECT id, username, email, role, created_at FROM admins ORDER BY created_at DESC')).rows;
  }

  async create({ username, email, password_hash, role }) {
    const result = await this.db.query('INSERT INTO admins (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role, created_at', [username, email, password_hash, role || 'admin']);
    return result.rows[0];
  }

  async delete(id) {
    const result = await this.db.query('DELETE FROM admins WHERE id=$1 RETURNING *', [id]);
    return result.rows[0];
  }

  async updatePassword(id, password_hash) {
    const result = await this.db.query('UPDATE admins SET password_hash=$1 WHERE id=$2 RETURNING email, username', [password_hash, id]);
    return result.rows[0];
  }
}

module.exports = AdminService; 