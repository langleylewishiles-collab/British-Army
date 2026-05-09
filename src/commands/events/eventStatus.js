import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
  .setName('event_status')
  .setDescription('Check the status of a specific event')
  .addStringOption(option =>
    option.setName('event_id')
      .setDescription('The ID of the event to check')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(0);

async function execute(interaction) {
  const eventId = interaction.options.getString('event_id');
  
  try {
    // TODO: Replace with actual database query
    // const event = await interaction.client.db.query('SELECT * FROM events WHERE id = $1', [eventId]);
    
    const event = {
      id: eventId,
      name: 'Sample Event',
      description: 'Event Description',
      startTime: new Date(),
      location: 'Virtual',
      capacity: 50,
      attendees: 25,
      status: 'ACTIVE',
      createdBy: 'user123'
    };
    
    const embed = new EmbedBuilder()
      .setColor(event.status === 'ACTIVE' ? 0x00FF00 : 0xFF0000)
      .setTitle(`📋 Event Status: ${event.name}`)
      .addFields(
        { name: 'Event ID', value: event.id, inline: true },
        { name: 'Status', value: event.status, inline: true },
        { name: 'Location', value: event.location, inline: false },
        { name: 'Start Time', value: event.startTime.toString(), inline: true },
        { name: 'Capacity', value: `${event.attendees}/${event.capacity}`, inline: true },
        { name: 'Created By', value: `<@${event.createdBy}>`, inline: true }
      )
      .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    await interaction.reply({
      content: `❌ Error checking event status: ${error.message}`,
      ephemeral: true
    });
  }
}

export { data, execute };