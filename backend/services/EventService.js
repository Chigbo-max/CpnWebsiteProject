const crypto = require('crypto');

// IEventService interface
class IEventService {
  createEvent(event) { throw new Error('Not implemented'); }
  getEvents() { throw new Error('Not implemented'); }
  getEventById(event_id) { throw new Error('Not implemented'); }
  isEventPast(event_id) { throw new Error('Not implemented'); }
  registerForEvent(event_id, data) { throw new Error('Not implemented'); }
  getRegistrationsForEvent(event_id) { throw new Error('Not implemented'); }
  getRegistrationsCSV(event_id) { throw new Error('Not implemented'); }
  updateEvent(event_id, updates) { throw new Error('Not implemented'); }
  deleteEvent(event_id) { throw new Error('Not implemented'); }
}

class EventServiceImpl extends IEventService {
  constructor(db) {
    super();
    this.db = db;
  }

  generateEventId(title) {
    const words = title.trim().split(/\s+/);
    const initials = words.map(word => word.charAt(0).toUpperCase()).join('');
    const rand = Math.floor(100 + Math.random() * 900);
    return `${initials}${rand}`;
  }

  generateRegistrationCode() {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
  }

  async createEvent(event) {
    const event_id = this.generateEventId(event.title);
    const query = `INSERT INTO events (event_id, title, description, image_url, event_type, location_address, location_map_url, virtual_link, start_time, end_time, created_by)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`;
    const values = [
      event_id,
      event.title,
      event.description,
      event.image_url,
      event.event_type,
      event.location_address,
      event.location_map_url,
      event.virtual_link,
      event.start_time,
      event.end_time,
      event.created_by
    ];
    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async getEvents() {
    const result = await this.db.query('SELECT * FROM events ORDER BY start_time DESC');
    return result.rows;
  }

  async getEventById(event_id) {
    const result = await this.db.query('SELECT * FROM events WHERE event_id = $1', [event_id]);
    return result.rows[0];
  }

  async isEventPast(event_id) {
    const event = await this.getEventById(event_id);
    if (!event) return true;
    return new Date(event.end_time) < new Date();
  }

  async registerForEvent(event_id, { name, email, phone }) {
    const code = this.generateRegistrationCode();
    const query = `INSERT INTO event_registrations (event_id, name, email, phone, registration_code)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [event_id, name, email, phone, code];
    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async getRegistrationsForEvent(event_id) {
    const result = await this.db.query('SELECT * FROM event_registrations WHERE event_id = $1 ORDER BY registered_at DESC', [event_id]);
    return result.rows;
  }

  async getRegistrationsCSV(event_id) {
    const regs = await this.getRegistrationsForEvent(event_id);
    if (!regs.length) return '';
    const header = 'Name,Email,Phone,Registration Code,Registered At\n';
    const rows = regs.map(r => `${r.name},${r.email},${r.phone || ''},${r.registration_code},${r.registered_at.toISOString()}`);
    return header + rows.join('\n');
  }

  async updateEvent(event_id, updates) {
    const fields = [];
    const values = [];
    let idx = 1;
    for (const key in updates) {
      if ([
        'title','description','image_url','event_type','location_address','location_map_url','virtual_link','start_time','end_time'
      ].includes(key)) {
        fields.push(`${key} = $${idx}`);
        values.push(updates[key]);
        idx++;
      }
    }
    if (!fields.length) return null;
    values.push(event_id);
    const query = `UPDATE events SET ${fields.join(', ')} WHERE event_id = $${idx} RETURNING *`;
    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async deleteEvent(event_id) {
    await this.db.query('DELETE FROM event_registrations WHERE event_id = $1', [event_id]);
    const result = await this.db.query('DELETE FROM events WHERE event_id = $1 RETURNING *', [event_id]);
    return result.rowCount > 0;
  }
}

module.exports = { IEventService, EventServiceImpl }; 