import { SlashCommandBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
  .setName('event_post')
  .setDescription('Post a new event (requires personnel to fill in required information)')
  .setDefaultMemberPermissions(0);

async function execute(interaction) {
  const modal = new ModalBuilder()
    .setCustomId('eventPostModal')
    .setTitle('Create New Event');

  const eventNameInput = new TextInputBuilder()
    .setCustomId('eventName')
    .setLabel('Event Name')
    .setPlaceholder('Enter the event name')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(100);

  const eventDescriptionInput = new TextInputBuilder()
    .setCustomId('eventDescription')
    .setLabel('Event Description')
    .setPlaceholder('Provide details about the event')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMaxLength(2000);

  const eventDateInput = new TextInputBuilder()
    .setCustomId('eventDate')
    .setLabel('Event Date & Time (YYYY-MM-DD HH:MM)')
    .setPlaceholder('2026-05-15 14:30')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const eventLocationInput = new TextInputBuilder()
    .setCustomId('eventLocation')
    .setLabel('Event Location')
    .setPlaceholder('Enter the location or "Virtual"')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(200);

  const eventCapacityInput = new TextInputBuilder()
    .setCustomId('eventCapacity')
    .setLabel('Event Capacity (number)')
    .setPlaceholder('e.g., 50')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  modal.addComponents(
    new ActionRowBuilder().addComponents(eventNameInput),
    new ActionRowBuilder().addComponents(eventDescriptionInput),
    new ActionRowBuilder().addComponents(eventDateInput),
    new ActionRowBuilder().addComponents(eventLocationInput),
    new ActionRowBuilder().addComponents(eventCapacityInput)
  );

  await interaction.showModal(modal);
}

export { data, execute };
