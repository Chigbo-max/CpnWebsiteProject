// IAuthService interface
class IAuthService {
  login(username, password) { throw new Error('Not implemented'); }
  getAdminByEmail(email) { throw new Error('Not implemented'); }
  getAdminById(id) { throw new Error('Not implemented'); }
  saveResetToken(adminId, token) { throw new Error('Not implemented'); }
  getAdminByResetToken(token) { throw new Error('Not implemented'); }
  updatePasswordAndInvalidateSessions(adminId, newPassword) { throw new Error('Not implemented'); }
  clearResetToken(adminId) { throw new Error('Not implemented'); }
  logResetAttempt({ email, token, ip, status, reason, type }) { throw new Error('Not implemented'); }
  invalidateToken(token, adminId) { throw new Error('Not implemented'); }
}

// AuthServiceImpl implements IAuthService
class AuthServiceImpl extends IAuthService {
  constructor(db, bcrypt, jwt) {
    super();
    this.db = db;
    this.bcrypt = bcrypt;
    this.jwt = jwt;
  }

  async login(username, password) {
    // Find admin by username
    const result = await this.db.query(
      'SELECT * FROM admins WHERE username = $1',
      [username]
    );
    if (result.rows.length === 0) {
      throw new Error('Invalid credentials');
    }
    const admin = result.rows[0];
    // Check password
    const isPasswordValid = await this.bcrypt.compare(password, admin.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    // Generate JWT token
    const token = this.jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    // Optionally: store token in sessions table for invalidation
    await this.db.query('INSERT INTO admin_sessions (admin_id, token, created_at) VALUES ($1, $2, NOW())', [admin.id, token]);
    return {
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    };
  }

  async getAdminByEmail(email) {
    const result = await this.db.query('SELECT * FROM admins WHERE email = $1', [email]);
    return result.rows[0];
  }

  async getAdminById(id) {
    const result = await this.db.query('SELECT id, username, email, role FROM admins WHERE id = $1', [id]);
    return result.rows[0];
  }

  async saveResetToken(adminId, token) {
    // Store token with expiry (1 hour)
    await this.db.query('INSERT INTO reset_tokens (admin_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'1 hour\') ON CONFLICT (admin_id) DO UPDATE SET token = $2, expires_at = NOW() + INTERVAL \'1 hour\'', [adminId, token]);
  }

  async getAdminByResetToken(token) {
    const result = await this.db.query(
      'SELECT a.* FROM admins a JOIN reset_tokens r ON a.id = r.admin_id WHERE r.token = $1 AND r.expires_at > NOW()',
      [token]
    );
    return result.rows[0];
  }

  async updatePasswordAndInvalidateSessions(adminId, newPassword) {
    const password_hash = await this.bcrypt.hash(newPassword, 10);
    await this.db.query('UPDATE admins SET password_hash = $1 WHERE id = $2', [password_hash, adminId]);
    // Invalidate all sessions for this admin
    await this.db.query('DELETE FROM admin_sessions WHERE admin_id = $1', [adminId]);
  }

  async clearResetToken(adminId) {
    await this.db.query('DELETE FROM reset_tokens WHERE admin_id = $1', [adminId]);
  }

  async logResetAttempt({ email, token, ip, status, reason, type }) {
    await this.db.query(
      'INSERT INTO password_reset_audit (email, token, ip, status, reason, type, timestamp) VALUES ($1, $2, $3, $4, $5, $6, NOW())',
      [email || null, token || null, ip, status, reason, type]
    );
  }

  async invalidateToken(token, adminId) {
    await this.db.query('DELETE FROM admin_sessions WHERE token = $1 AND admin_id = $2', [token, adminId]);
  }

  async changePassword(adminId, currentPassword, newPassword) {
    const result = await this.db.query('SELECT password_hash FROM admins WHERE id = $1', [adminId]);
    if (result.rows.length === 0) throw new Error('Admin not found');
    const isPasswordValid = await this.bcrypt.compare(currentPassword, result.rows[0].password_hash);
    if (!isPasswordValid) return false;
    const password_hash = await this.bcrypt.hash(newPassword, 10);
    await this.db.query('UPDATE admins SET password_hash = $1 WHERE id = $2', [password_hash, adminId]);
    // Invalidate all sessions for this admin
    await this.db.query('DELETE FROM admin_sessions WHERE admin_id = $1', [adminId]);
    return true;
  }

  async getAuditLog(email) {
    const result = await this.db.query(
      'SELECT ip, status, reason, type, timestamp FROM password_reset_audit WHERE email = $1 ORDER BY timestamp DESC LIMIT 20',
      [email]
    );
    return result.rows;
  }
}

module.exports = { IAuthService, AuthServiceImpl }; 