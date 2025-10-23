// clear.js
// --------
// Slash command to bulk delete messages in a channel.

import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('clear')
  .setDescription('Bulk delete messages')
  .addIntegerOption(option =>
    option.setName('amount')
      .setDescription('Number of messages to delete (1-100)')
      .setRequired(true))
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

export const execute = async (interaction) => {
  const amount = interaction.options.getInteger('amount');
  const moderator = interaction.user;
  const LOG_CHANNEL_ID = 'YOUR_LOG_CHANNEL_ID';

  if (amount < 1 || amount > 100) return interaction.reply({ content: '⚠️ Amount must be between 1 and 100.', ephemeral: true });

  try {
    // Bulk delete messages
    const deleted = await interaction.channel.bulkDelete(amount, true);

    await interaction.reply({ content: `✅ Deleted ${deleted.size} messages.`, ephemeral: false });

    // Log embed
    const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);
    if (logChannel) {
      const embed = new EmbedBuilder()
        .setTitle('Messages Cleared')
        .setColor('Grey')
        .addFields(
          { name: 'Moderator', value: `${moderator.tag}`, inline: true },
          { name: 'Channel', value: `${interaction.channel.name}`, inline: true },
          { name: 'Amount Deleted', value: `${deleted.size}`, inline: true },
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] });
    }

  } catch (error) {
    console.error(error);
    interaction.reply({ content: '❌ Could not delete messages.', ephemeral: true });
  }
};
