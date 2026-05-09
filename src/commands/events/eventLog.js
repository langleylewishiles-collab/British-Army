import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

const data = new SlashCommandBuilder()
  .setName('event_log')
  .setDescription('View event logs with filtering')
  .addStringOption(option =>
    option.setName('filter')
      .setDescription('Filter events by status')
      .setChoices(
        { name: 'All Events', value: 'all' },
        { name: 'Active Events', value: 'active' },
        { name: 'Concluded Events', value: 'concluded' },
        { name: 'Pending Approval', value: 'pending' }
      )
      .setRequired(false)
  )
  .setDefaultMemberPermissions(0);

async function execute(interaction) {
  const filter = interaction.options.getString('filter') || 'all';
  
  try {
    // TODO: Replace with actual database query
    // const events = await interaction.client.db.query(
    //   'SELECT * FROM events WHERE status = $1 ORDER BY created_at DESC LIMIT 10',
    //   [filter === 'all' ? null : filter.toUpperCase()]
    // );
    
    const events = [
      {
        id: '1',
        name: 'Sample Event 1',
        status: 'ACTIVE',
        startTime: new Date(),
        createdBy: 'user1'
      },
      {
        id: '2',
        name: 'Sample Event 2',
        status: 'CONCLUDED',
        startTime: new Date(),
        createdBy: 'user2'
      }
    ];
    
    if (events.length === 0) {
      return await interaction.reply({
        content: `No events found with filter: ${filter}`,
        ephemeral: true
      });
    }
    
    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle(`📅 Event Log (${filter.toUpperCase()})`)
      .setDescription(events.map((e, i) => 
        `${i + 1}. **${e.name}** - ${e.status} (ID: \`${e.id}\`)`
      ).join('\n'))
      .setTimestamp();
    
    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('event_log_prev')
        .setLabel('← Previous')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('event_log_next')
        .setLabel('Next →')
        .setStyle(ButtonStyle.Primary)
    );
    
    await interaction.reply({ embeds: [embed], components: [buttons] });
  } catch (error) {
    await interaction.reply({
      content: `❌ Error retrieving event log: ${error.message}`,
      ephemeral: true
    });
  }
}

export { data, execute };