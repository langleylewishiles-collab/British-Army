import { logger } from '../utils/logger.js';
import { EmbedBuilder } from 'discord.js';
import EventModel from '../models/EventModel.js';

const modalHandlers = {
  eventPostModal: async (interaction, client) => {
    try {
      const eventName = interaction.fields.getTextInputValue('eventName');
      const eventDescription = interaction.fields.getTextInputValue('eventDescription');
      const eventDate = interaction.fields.getTextInputValue('eventDate');
      const eventLocation = interaction.fields.getTextInputValue('eventLocation');
      const eventCapacity = parseInt(interaction.fields.getTextInputValue('eventCapacity'));

      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/;
      if (!dateRegex.test(eventDate)) {
        return await interaction.reply({
          content: '❌ Invalid date format. Please use YYYY-MM-DD HH:MM',
          ephemeral: true
        });
      }

      // Validate capacity is a positive number
      if (isNaN(eventCapacity) || eventCapacity < 1) {
        return await interaction.reply({
          content: '❌ Capacity must be a positive number',
          ephemeral: true
        });
      }

      const eventId = `evt_${Date.now()}_${interaction.user.id}`;
      const startTime = new Date(eventDate);

      // TODO: Save to database using EventModel
      // const eventModel = new EventModel(client.db);
      // const event = await eventModel.createEvent({
      //   id: eventId,
      //   guildId: interaction.guildId,
      //   name: eventName,
      //   description: eventDescription,
      //   startTime,
      //   location: eventLocation,
      //   capacity: eventCapacity,
      //   createdBy: interaction.user.id
      // });

      const embed = new EmbedBuilder()
        .setColor(0xFFA500)
        .setTitle('📝 Event Posted')
        .addFields(
          { name: 'Event Name', value: eventName, inline: false },
          { name: 'Description', value: eventDescription, inline: false },
          { name: 'Start Time', value: startTime.toString(), inline: true },
          { name: 'Location', value: eventLocation, inline: true },
          { name: 'Capacity', value: eventCapacity.toString(), inline: true },
          { name: 'Status', value: 'PENDING APPROVAL', inline: false },
          { name: 'Event ID', value: `\`${eventId}\``, inline: false }
        )
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
      logger.info(`Event created: ${eventId} by ${interaction.user.tag}`);
    } catch (error) {
      logger.error('Error in eventPostModal handler:', error);
      await interaction.reply({
        content: `❌ Error posting event: ${error.message}`,
        ephemeral: true
      });
    }
  },

  eventConcludeModal: async (interaction, client) => {
    try {
      const customId = interaction.customId.split('_');
      const eventId = customId[2];
      const summary = interaction.fields.getTextInputValue('concludeSummary');
      const finalAttendance = interaction.fields.getTextInputValue('finalAttendance');

      // TODO: Update event in database
      // const eventModel = new EventModel(client.db);
      // await eventModel.concludeEvent(
      //   eventId,
      //   interaction.user.id,
      //   summary,
      //   parseInt(finalAttendance) || 0
      // );

      const embed = new EmbedBuilder()
        .setColor(0x00AA00)
        .setTitle('✅ Event Concluded')
        .addFields(
          { name: 'Event ID', value: eventId, inline: true },
          { name: 'Concluded By', value: interaction.user.tag, inline: true },
          { name: 'Summary', value: summary || 'No summary provided', inline: false },
          { name: 'Final Attendance', value: finalAttendance || '0', inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
      logger.info(`Event concluded: ${eventId} by ${interaction.user.tag}`);
    } catch (error) {
      logger.error('Error in eventConcludeModal handler:', error);
      await interaction.reply({
        content: `❌ Error concluding event: ${error.message}`,
        ephemeral: true
      });
    }
  }
};

export default modalHandlers;