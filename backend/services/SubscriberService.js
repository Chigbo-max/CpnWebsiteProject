const Subscriber = require('../models/Subscriber');

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
  constructor() {
    super();
  }

  async getAll() {
    return await Subscriber.find({}).sort({ subscribed_at: -1 });
  }

  async create({ name, email }) {
    const subscriber = new Subscriber({ name, email });
    return await subscriber.save();
  }

  async update(id, { name, email }) {
    return await Subscriber.findByIdAndUpdate(id, { name, email }, { new: true });
  }

  async delete(id) {
    return await Subscriber.findByIdAndDelete(id);
  }

  async findByEmail(email) {
    return await Subscriber.find({ email });
  }

  async deleteByEmail(email) {
    return await Subscriber.findOneAndDelete({ email });
  }

  async getMonthlyCounts() {
    // Returns [{ year: 2024, month: 6, count: 10 }, ...]
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    return await Subscriber.aggregate([
      {
        $match: {
          subscribed_at: { $gte: twelveMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$subscribed_at' },
            month: { $month: '$subscribed_at' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          year: '$_id.year',
          month: '$_id.month',
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { year: 1, month: 1 }
      }
    ]);
  }
}

module.exports = { ISubscriberService, SubscriberServiceImpl }; 