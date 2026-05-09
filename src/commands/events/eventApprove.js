import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

const data = new SlashCommandBuilder()
  .setName('event_approve')
  .setDescription('Approve a pending event log (Moderator only)')
  .addStringOption(option =>
    option.setName('event_id')
      .setDescription('The ID of the event to approve')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('notes')
      .setDescription('Optional approval notes')
      .setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

async function execute(interaction) {
  const eventId = interaction.options.getString('event_id');
  const notes = interaction.options.getString('notes') || 'No notes';
  
  try {
    // TODO: Replace with actual database query
    // await interaction.client.db.query(
    //   'UPDATE events SET status = $1, approved_by = $2, approval_notes = $3, approved_at = NOW() WHERE id = $4',
    //   ['APPROVED', interaction.user.id, notes, eventId]
    // );
    
    const embed = new EmbedBuilder()
      .setColor(0x00FF00)
      .setTitle('✅ Event Approved')
      .addFields(
        { name: 'Event ID', value: eventId, inline: true },
        { name: 'Approved By', value: interaction.user.tag, inline: true },
        { name: 'Approval Notes', value: notes, inline: false }
      )
      .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    await interaction.reply({
      content: `❌ Error approving event: ${error.message}`,
      ephemeral: true
    });
  }
}

export { data, execute };