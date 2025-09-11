const Admin = require('../models/Admin');

// IAdminService interface
class IAdminService {
  getAll() { throw new Error('Not implemented'); }
  create(data) { throw new Error('Not implemented'); }
  delete(id) { throw new Error('Not implemented'); }
  updatePassword(id, password_hash) { throw new Error('Not implemented'); }
  update(id, updateData) { throw new Error('Not implemented'); }
  getProfile(adminId) { throw new Error('Not implemented'); }
}

// AdminServiceImpl implements IAdminService
class AdminServiceImpl extends IAdminService {
  constructor() {
    super();
  }

  async getAll() {
    return await Admin.find({}).select('username email role createdAt').sort({ createdAt: -1 });
  }

  async create({ username, email, password_hash, role }) {
    const existing = await Admin.findOne({ username });
    if (existing) {
      throw new Error(`Admin with username "${username}" already exists`);
    }

    const admin = new Admin({
      username,
      email,
      password_hash,
      role: role || 'admin'
    });
    return await admin.save();
  }


  async delete(id) {
    return await Admin.findByIdAndDelete(id);
  }

  async updatePassword(id, password_hash) {
    return await Admin.findByIdAndUpdate(id, { password_hash }, { new: true }).select('email username');
  }

  async update(id, updateData) {
    const { username, email } = updateData;
    return await Admin.findByIdAndUpdate(
      id,
      { username, email },
      { new: true }
    ).select('username email role createdAt');
  }

  async updateProfile(id, updateData) {
    const { username, email, profilePic } = updateData;
    return await Admin.findByIdAndUpdate(
      id,
      { username, email, profile_pic: profilePic },
      { new: true }
    ).select('username email role profile_pic createdAt');
  }

  async getProfile(adminId) {
    return await Admin.findById(adminId).select('username email role profile_pic createdAt');
  }
}

module.exports = { IAdminService, AdminServiceImpl }; 