# Event Commands Integration Guide

## Overview
The Event Commands system allows members to post, track, approve, and manage events within your Discord server.

## Commands Available

### 1. `/event_post`
Create a new event by filling out a form with required information.
- **Form Fields:**
  - Event Name (required, max 100 chars)
  - Event Description (required, max 2000 chars)
  - Event Date & Time (required, format: YYYY-MM-DD HH:MM)
  - Event Location (required, max 200 chars)
  - Event Capacity (required, positive number)
- **Status:** Automatically set to PENDING APPROVAL
- **Permissions:** All members

### 2. `/event_status <event_id>`
Check the current status of a specific event.
- **Parameters:** Event ID
- **Shows:**
  - Event name and ID
  - Current status (ACTIVE, PENDING, CONCLUDED, etc.)
  - Location and start time
  - Current attendance vs. capacity
  - Created by (user tag)
- **Permissions:** All members

### 3. `/event_conclude <event_id>`
End/conclude an event with optional summary.
- **Parameters:** Event ID
- **Form Fields:**
  - Event Summary (optional, max 2000 chars)
  - Final Attendance Count (optional, number)
- **Status:** Changed to CONCLUDED
- **Permissions:** All members

### 4. `/event_log [filter]`
View event history with filtering options.
- **Filter Options:**
  - All Events (default)
  - Active Events
  - Concluded Events
  - Pending Approval
- **Display:** Up to 10 events per page with pagination
- **Permissions:** All members

### 5. `/event_approve <event_id> [notes]` ⭐ MODERATOR ONLY
Approve a pending event (requires Manage Guild permission).
- **Parameters:**
  - Event ID (required)
  - Approval Notes (optional)
- **Status:** Changed to APPROVED
- **Records:** Approval timestamp and moderator info
- **Permissions:** Manage Guild

### 6. `/event_deny <event_id> <reason>` ⭐ MODERATOR ONLY
Deny a pending event (requires Manage Guild permission).
- **Parameters:**
  - Event ID (required)
  - Reason for Denial (required)
- **Status:** Changed to DENIED
- **Records:** Denial timestamp, moderator, and reason
- **Permissions:** Manage Guild

## Integration Steps

### Step 1: Add EventModel to Database Initialization
Edit `src/app.js` and add EventModel initialization:

```javascript
import EventModel from './models/EventModel.js';

// In the start() method, after database initialization:
await new EventModel(this.db).initialize();
this.eventModel = new EventModel(this.db);
```

### Step 2: Register Modal Handlers
Add to your interactions handler (`src/handlers/interactions.js`):

```javascript
import eventModalHandlers from '../handlers/eventModalHandler.js';

// When handling modals:
if (interaction.isModalSubmit()) {
  const handlerName = interaction.customId.split('_')[0] + '_' + interaction.customId.split('_')[1];
  const handler = eventModalHandlers[handlerName];
  
  if (handler) {
    await handler(interaction, client);
  }
}
```

### Step 3: Ensure Commands are Loaded
Verify that the command loader picks up files from `src/commands/events/`.

### Step 4: Connect Database Queries
Replace all `TODO: Replace with actual database query` comments in the files with actual calls using your EventModel:

```javascript
const eventModel = new EventModel(interaction.client.db);
const event = await eventModel.getEventById(eventId);
```

## Database Schema

### events table
```sql
CREATE TABLE events (
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
);
```

## Event Status Flow

```
POSTED → PENDING → (APPROVED or DENIED)
  ↓
If APPROVED:
  → ACTIVE → CONCLUDED

If DENIED:
  → [Event rejected, no further action]
```

## Examples

### Creating an Event
```
/event_post
→ Fill modal with event details
→ Event created with PENDING status
→ Awaits moderator approval
```

### Approving an Event
```
/event_approve event_id:evt_123456_789
→ Event status changes to APPROVED
→ Event becomes ACTIVE
```

### Concluding an Event
```
/event_conclude event_id:evt_123456_789
→ Fill modal with final details (optional)
→ Event status changes to CONCLUDED
→ Final attendance recorded
```

## Troubleshooting

### Commands not appearing
- Ensure command files are in `src/commands/events/`
- Check that command loader includes the events directory
- Try restarting the bot

### Modal not submitting
- Verify modal handler is registered in interactions handler
- Check that customId matches between command and handler

### Database errors
- Ensure PostgreSQL connection is active
- Verify EventModel is initialized in app.js
- Check that events table has been created

### Permissions issues
- Use `/event_approve` and `/event_deny` with an account that has "Manage Guild" permission
- Server owner and administrators should have this permission by default

## Future Enhancements

- Add event reminder notifications
- Implement event recurring schedules
- Add attendee tracking and RSVP system
- Create event statistics dashboard
- Add event categories/types
- Implement event cancellation with notifications
