const User = require('../models/User');

class IUserService {
  register(data) { throw new Error('Not implemented'); }
  list() { throw new Error('Not implemented'); }
  stats() { throw new Error('Not implemented'); }
}

class UserServiceImpl extends IUserService {
  async register({ email, firstName, lastName, whatsapp, nationality, state, otherCountry }) {
    if (!email || !firstName || !lastName || !whatsapp || !nationality) {
      const err = new Error('All fields are required');
      err.code = 'VALIDATION_ERROR';
      throw err;
    }

    const isNigeria = typeof nationality === 'string' && nationality.trim().toLowerCase() === 'nigeria';
    const isOther = typeof nationality === 'string' && nationality.trim().toLowerCase() === 'other';
    if (isNigeria && !state) {
      const err = new Error('State of residence is required for Nigeria');
      err.code = 'VALIDATION_ERROR';
      throw err;
    }
    if (isOther) {
      if (!otherCountry || !otherCountry.trim()) {
        const err = new Error('Please specify your country');
        err.code = 'VALIDATION_ERROR';
        throw err;
      }
      nationality = otherCountry.trim();
    }

    const existing = await User.findOne({ email });
    if (existing) {
      const err = new Error('User with this email already exists');
      err.code = 'CONFLICT';
      throw err;
    }

    const user = new User({ email, firstName, lastName, whatsapp, nationality, state: isNigeria ? state : '' });
    return await user.save();
  }

  async list() {
    return await User.find({ isActive: true }).sort({ registeredAt: -1 }).select('-__v');
  }

  async stats() {
    const totalUsers = await User.countDocuments({ isActive: true });
    const todayUsers = await User.countDocuments({
      isActive: true,
      registeredAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    const thisWeekUsers = await User.countDocuments({
      isActive: true,
      registeredAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    const usersByState = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$state', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const usersByNationality = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$nationality', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    return { totalUsers, todayUsers, thisWeekUsers, usersByState, usersByNationality };
  }
}

module.exports = { IUserService, UserServiceImpl };


