import { logger } from '../utils/logger.js';

class EventModel {
  constructor(db) {
    this.db = db;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      await this.createTable();
      this.initialized = true;
      logger.info('✅ EventModel initialized');
    } catch (error) {
      logger.error('Failed to initialize EventModel:', error);
      throw error;
    }
  }

  async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS events (
        id VARCHAR(50) PRIMARY KEY,
        guild_id VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        start_time TIMESTAMP NOT NULL,
        location VARCHAR(255) NOT NULL,
        capacity INTEGER NOT NULL DEFAULT 50,
        attendees INTEGER NOT NULL DEFAULT 0,
        status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
        created_by VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        approved_by VARCHAR(50),
        approval_notes TEXT,
        approved_at TIMESTAMP,
        denied_by VARCHAR(50),
        denial_reason TEXT,
        denied_at TIMESTAMP,
        concluded_by VARCHAR(50),
        concluded_summary TEXT,
        concluded_at TIMESTAMP,
        final_attendance INTEGER,
        INDEX idx_guild_id (guild_id),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      )
    `;
    
    await this.db.query(query);
  }

  async createEvent(eventData) {
    const {
      id,
      guildId,
      name,
      description,
      startTime,
      location,
      capacity,
      createdBy
    } = eventData;

    const query = `
      INSERT INTO events (
        id, guild_id, name, description, start_time, location,
        capacity, created_by, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDING')
      RETURNING *
    `;

    const result = await this.db.query(query, [
      id,
      guildId,
      name,
      description,
      startTime,
      location,
      capacity,
      createdBy
    ]);

    return result.rows[0];
  }

  async getEventById(eventId) {
    const query = 'SELECT * FROM events WHERE id = $1';
    const result = await this.db.query(query, [eventId]);
    return result.rows[0] || null;
  }

  async getEventsByGuild(guildId, filter = 'all', limit = 10, offset = 0) {
    let query = 'SELECT * FROM events WHERE guild_id = $1';
    const params = [guildId];

    if (filter !== 'all') {
      query += ' AND status = $2';
      params.push(filter.toUpperCase());
    }

    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const result = await this.db.query(query, params);
    return result.rows;
  }

  async approveEvent(eventId, approvedBy, notes = '') {
    const query = `
      UPDATE events
      SET status = 'APPROVED', approved_by = $1, approval_notes = $2, approved_at = NOW()
      WHERE id = $3
      RETURNING *
    `;

    const result = await this.db.query(query, [approvedBy, notes, eventId]);
    return result.rows[0];
  }

  async denyEvent(eventId, deniedBy, reason) {
    const query = `
      UPDATE events
      SET status = 'DENIED', denied_by = $1, denial_reason = $2, denied_at = NOW()
      WHERE id = $3
      RETURNING *
    `;

    const result = await this.db.query(query, [deniedBy, reason, eventId]);
    return result.rows[0];
  }

  async concludeEvent(eventId, concludedBy, summary = '', finalAttendance = 0) {
    const query = `
      UPDATE events
      SET status = 'CONCLUDED', concluded_by = $1, concluded_summary = $2, 
          concluded_at = NOW(), final_attendance = $3
      WHERE id = $4
      RETURNING *
    `;

    const result = await this.db.query(query, [concludedBy, summary, finalAttendance, eventId]);
    return result.rows[0];
  }

  async updateEventAttendees(eventId, attendeeCount) {
    const query = `
      UPDATE events
      SET attendees = $1
      WHERE id = $2
      RETURNING *
    `;

    const result = await this.db.query(query, [attendeeCount, eventId]);
    return result.rows[0];
  }

  async deleteEvent(eventId) {
    const query = 'DELETE FROM events WHERE id = $1 RETURNING *';
    const result = await this.db.query(query, [eventId]);
    return result.rows[0];
  }

  async getEventCount(guildId, filter = 'all') {
    let query = 'SELECT COUNT(*) as count FROM events WHERE guild_id = $1';
    const params = [guildId];

    if (filter !== 'all') {
      query += ' AND status = $2';
      params.push(filter.toUpperCase());
    }

    const result = await this.db.query(query, params);
    return result.rows[0].count;
  }
}

export default EventModel;