const Admin = require('../models/Admin');
const AdminSession = require('../models/AdminSession');
const ResetToken = require('../models/ResetToken');
const PasswordResetAudit = require('../models/PasswordResetAudit');

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
  constructor(bcrypt, jwt) {
    super();
    this.bcrypt = bcrypt;
    this.jwt = jwt;
  }

  async login(username, password) {
    // Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      throw new Error('Invalid credentials');
    }
    
    // Check password
    const isPasswordValid = await this.bcrypt.compare(password, admin.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    
    // Generate JWT token
    const token = this.jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Store token in sessions table for invalidation
    await AdminSession.create({ admin_id: admin._id, token });
    
    return {
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    };
  }

  async getAdminByEmail(email) {
    return await Admin.findOne({ email });
  }

  async getAdminById(id) {
    return await Admin.findById(id).select('username email role');
  }

  async saveResetToken(adminId, token) {
    // Store token with expiry (1 hour)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); 
    await ResetToken.findOneAndUpdate(
      { admin_id: adminId },
      { token, expires_at: expiresAt },
      { upsert: true }
    );
  }

  async getAdminByResetToken(token) {
    const resetToken = await ResetToken.findOne({ 
      token, 
      expires_at: { $gt: new Date() } 
    }).populate('admin_id');
    
    return resetToken ? resetToken.admin_id : null;
  }

  async updatePasswordAndInvalidateSessions(adminId, newPassword) {
    const password_hash = await this.bcrypt.hash(newPassword, 10);
    await Admin.findByIdAndUpdate(adminId, { password_hash });
    // Invalidate all sessions for this admin
    await AdminSession.deleteMany({ admin_id: adminId });
  }

  async clearResetToken(adminId) {
    await ResetToken.deleteOne({ admin_id: adminId });
  }

  async logResetAttempt({ email, token, ip, status, reason, type }) {
    await PasswordResetAudit.create({
      email: email || null,
      token: token || null,
      ip,
      status,
      reason,
      type
    });
  }

  async invalidateToken(token, adminId) {
    await AdminSession.deleteOne({ token, admin_id: adminId });
  }

  async changePassword(adminId, currentPassword, newPassword) {
    const admin = await Admin.findById(adminId);
    if (!admin) throw new Error('Admin not found');
    
    const isPasswordValid = await this.bcrypt.compare(currentPassword, admin.password_hash);
    if (!isPasswordValid) return false;
    
    const password_hash = await this.bcrypt.hash(newPassword, 10);
    await Admin.findByIdAndUpdate(adminId, { password_hash });
    // Invalidate all sessions for this admin
    await AdminSession.deleteMany({ admin_id: adminId });
    return true;
  }

  async getAuditLog(email) {
    return await PasswordResetAudit.find({ email })
      .select('ip status reason type createdAt')
      .sort({ createdAt: -1 })
      .limit(20);
  }
}

module.exports = { IAuthService, AuthServiceImpl }; 