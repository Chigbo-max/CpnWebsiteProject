const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const crypto = require('crypto');


class IEventService{
  createEvent(event){ throw new Error('Not implemented');}
  getEvents(){ throw new Error('Not implemented');}
  getEventById(event_id){ throw new Error('Not implemented');}
  isEventPast(event_id){ throw new Error('Not implemented');}
  registerForEvent(event_id, { name, email, phone }){ throw new Error('Not implemented');}
  getRegistrationsForEvent(event_id){ throw new Error('Not implemented');}
  getRegistrationsCSV(event_id){ throw new Error('Not implemented');}
  updateEvent(event_id, updates){ throw new Error('Not implemented');}
  deleteEvent(event_id){ throw new Error('Not implemented');}
}

class EventServiceImpl extends IEventService {
  constructor() {
    super();
  }

  generateEventId(title) {
    const words = title.trim().split(/\s+/);
    const initials = words.map(w => w[0].toUpperCase()).join('');
    const rand = Math.floor(100 + Math.random() * 900);
    return `${initials}${rand}`;
  }

  generateRegistrationCode() {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
  }

  async createEvent(event) {
    const event_id = this.generateEventId(event.title);
    const newEvent = new Event({
      event_id,
      title: event.title,
      description: event.description,
      image_url: event.image_url,
      event_type: event.event_type,
      location_address: event.location_address,
      location_map_url: event.location_map_url,
      virtual_link: event.virtual_link,
      start_time: event.start_time,
      end_time: event.end_time,
      created_by: event.created_by
    });
    return await newEvent.save();
  }

  async getEvents() {
    return await Event.find().sort({ start_time: -1 });
  }

  async getEventById(event_id) {
    return await Event.findOne({ event_id });
  }

  async isEventPast(event_id) {
    const event = await this.getEventById(event_id);
    if (!event) return true;
    return new Date(event.end_time) < new Date();
  }

  async registerForEvent(event_id, { name, email, phone }) {
    const code = this.generateRegistrationCode();
    const reg = new EventRegistration({
      event_id,
      name,
      email,
      phone,
      registration_code: code
    });
    return await reg.save();
  }

  async getRegistrationsForEvent(event_id) {
    return await EventRegistration.find({ event_id }).sort({ registered_at: -1 });
  }

  async getRegistrationsCSV(event_id) {
    const regs = await this.getRegistrationsForEvent(event_id);
    if (!regs.length) return '';

    const header = 'Name,Email,Phone,Registration Code,Registered At\n';
    const rows = regs.map(r =>
      `${r.name},${r.email},${r.phone || ''},${r.registration_code},${r.registered_at.toISOString()}`
    );
    return header + rows.join('\n');
  }

  async updateEvent(event_id, updates) {
    const allowed = [
      'title','description','image_url','event_type',
      'location_address','location_map_url','virtual_link',
      'start_time','end_time'
    ];
    const filteredUpdates = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }
    if (!Object.keys(filteredUpdates).length) return null;

    return await Event.findOneAndUpdate(
      { event_id },
      filteredUpdates,
      { new: true }
    );
  }

  async deleteEvent(event_id) {
    await EventRegistration.deleteMany({ event_id });
    const result = await Event.findOneAndDelete({ event_id });
    return !!result;
  }
}

module.exports = { IEventService, EventServiceImpl };
