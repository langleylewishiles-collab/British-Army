import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

const data = new SlashCommandBuilder()
  .setName('event_deny')
  .setDescription('Deny a pending event log (Moderator only)')
  .addStringOption(option =>
    option.setName('event_id')
      .setDescription('The ID of the event to deny')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('reason')
      .setDescription('Reason for denial')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

async function execute(interaction) {
  const eventId = interaction.options.getString('event_id');
  const reason = interaction.options.getString('reason');
  
  try {
    // TODO: Replace with actual database query
    // await interaction.client.db.query(
    //   'UPDATE events SET status = $1, denied_by = $2, denial_reason = $3, denied_at = NOW() WHERE id = $4',
    //   ['DENIED', interaction.user.id, reason, eventId]
    // );
    
    const embed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle('❌ Event Denied')
      .addFields(
        { name: 'Event ID', value: eventId, inline: true },
        { name: 'Denied By', value: interaction.user.tag, inline: true },
        { name: 'Reason for Denial', value: reason, inline: false }
      )
      .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    await interaction.reply({
      content: `❌ Error denying event: ${error.message}`,
      ephemeral: true
    });
  }
}

export { data, execute };