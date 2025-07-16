const db = require('../config/database');
const crypto = require('crypto');

function generateEventId(title) {
  // Slugify title and append random 4-digit number
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${slug}-${rand}`;
}

function generateRegistrationCode() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

async function createEvent(event) {
  try{
    console.log('Creating event:', event);
  const event_id = generateEventId(event.title);
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
  console.log('Running DB query:', query, values);

  const result = await db.query(query, values);
  console.log('DB query result:', result.rows[0]);

  return result.rows[0];
} catch (err) {
  console.error('Error creating event:', err);
  throw err;
}
}

async function getEvents() {
  const result = await db.query('SELECT * FROM events ORDER BY start_time DESC');
  return result.rows;
}

async function getEventById(event_id) {
  const result = await db.query('SELECT * FROM events WHERE event_id = $1', [event_id]);
  return result.rows[0];
}

async function isEventPast(event_id) {
  const event = await getEventById(event_id);
  if (!event) return true;
  return new Date(event.end_time) < new Date();
}

async function registerForEvent(event_id, { name, email, phone }) {
  const code = generateRegistrationCode();
  const query = `INSERT INTO event_registrations (event_id, name, email, phone, registration_code)
    VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const values = [event_id, name, email, phone, code];
  const result = await db.query(query, values);
  return result.rows[0];
}

async function getRegistrationsForEvent(event_id) {
  const result = await db.query('SELECT * FROM event_registrations WHERE event_id = $1 ORDER BY registered_at DESC', [event_id]);
  return result.rows;
}

async function getRegistrationsCSV(event_id) {
  const regs = await getRegistrationsForEvent(event_id);
  if (!regs.length) return '';
  const header = 'Name,Email,Phone,Registration Code,Registered At\n';
  const rows = regs.map(r => `${r.name},${r.email},${r.phone || ''},${r.registration_code},${r.registered_at.toISOString()}`);
  return header + rows.join('\n');
}

async function updateEvent(event_id, updates) {
  // Build dynamic SET clause
  const fields = [];
  const values = [];
  let idx = 1;
  for (const key in updates) {
    if (['title','description','image_url','event_type','location_address','location_map_url','virtual_link','start_time','end_time'].includes(key)) {
      fields.push(`${key} = $${idx}`);
      values.push(updates[key]);
      idx++;
    }
  }
  if (!fields.length) return null;
  values.push(event_id);
  const query = `UPDATE events SET ${fields.join(', ')} WHERE event_id = $${idx} RETURNING *`;
  const result = await db.query(query, values);
  return result.rows[0];
}

async function deleteEvent(event_id) {
  // Delete registrations first (if ON DELETE CASCADE is not set)
  await db.query('DELETE FROM event_registrations WHERE event_id = $1', [event_id]);
  const result = await db.query('DELETE FROM events WHERE event_id = $1 RETURNING *', [event_id]);
  return result.rowCount > 0;
}

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  registerForEvent,
  getRegistrationsForEvent,
  getRegistrationsCSV,
  isEventPast,
  generateEventId,
  generateRegistrationCode,
  updateEvent,
  deleteEvent
}; 