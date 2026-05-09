import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
  .setName('event_conclude')
  .setDescription('Conclude/end an event')
  .addStringOption(option =>
    option.setName('event_id')
      .setDescription('The ID of the event to conclude')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(0);

async function execute(interaction) {
  const eventId = interaction.options.getString('event_id');
  
  const modal = new ModalBuilder()
    .setCustomId(`eventConcludeModal_${eventId}`)
    .setTitle('Conclude Event');
  
  const summaryInput = new TextInputBuilder()
    .setCustomId('concludeSummary')
    .setLabel('Event Summary (Optional)')
    .setPlaceholder('Provide a summary of the event')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(false)
    .setMaxLength(2000);
  
  const attendanceInput = new TextInputBuilder()
    .setCustomId('finalAttendance')
    .setLabel('Final Attendance Count')
    .setPlaceholder('Enter final number of attendees')
    .setStyle(TextInputStyle.Short)
    .setRequired(false);
  
  modal.addComponents(
    new ActionRowBuilder().addComponents(summaryInput),
    new ActionRowBuilder().addComponents(attendanceInput)
  );
  
  await interaction.showModal(modal);
}

export { data, execute };