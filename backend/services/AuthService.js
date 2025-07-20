// IAuthService interface
class IAuthService {
  login(username, password) { throw new Error('Not implemented'); }
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
}

module.exports = { IAuthService, AuthServiceImpl }; 