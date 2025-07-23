// IAdminService interface
class IAdminService {
  getAll() { throw new Error('Not implemented'); }
  create(data) { throw new Error('Not implemented'); }
  delete(id) { throw new Error('Not implemented'); }
  updatePassword(id, password_hash) { throw new Error('Not implemented'); }
  update(id, updateData) { throw new Error('Not implemented'); }
}

// AdminServiceImpl implements IAdminService
class AdminServiceImpl extends IAdminService {
  constructor(db) {
    super();
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

  async update(id, updateData) {
    const { username, email } = updateData;
    const result = await this.db.query(
      'UPDATE admins SET username=$1, email=$2 WHERE id=$3 RETURNING id, username, email, role, created_at',
      [username, email, id]
    );
    return result.rows[0];
  }

  async updateProfile(id, updateData) {
    const { username, email, profilePic } = updateData;
    const result = await this.db.query(
      'UPDATE admins SET username=$1, email=$2, profile_pic=$3 WHERE id=$4 RETURNING id, username, email, role, profile_pic, created_at',
      [username, email, profilePic, id]
    );
    return result.rows[0];
  }
}

module.exports = { IAdminService, AdminServiceImpl }; 