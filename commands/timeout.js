// timeout.js
// --------
// Slash command to timeout a member (mute for a duration).

import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('timeout')
  .setDescription('Timeout a member')
  .addUserOption(option =>
    option.setName('target')
      .setDescription('The member to timeout')
      .setRequired(true))
  .addIntegerOption(option =>
    option.setName('duration')
      .setDescription('Duration in minutes')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('reason')
      .setDescription('Reason for timeout')
      .setRequired(false))
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

export const execute = async (interaction) => {
  const member = interaction.options.getMember('target');
  const duration = interaction.options.getInteger('duration');
  const reason = interaction.options.getString('reason') || 'No reason provided';
  const moderator = interaction.user;
  const LOG_CHANNEL_ID = 'YOUR_LOG_CHANNEL_ID';

  if (!member) return interaction.reply({ content: '⚠️ Member not found.', ephemeral: true });

  try {
    const durationMs = duration * 60 * 1000; // convert minutes to milliseconds

    // DM the member
    await member.send(`You have been timed out in **${interaction.guild.name}** by ${moderator.tag} for ${duration} minutes. Reason: ${reason}`).catch(() => null);

    // Apply timeout
    await member.timeout(durationMs, reason);

    await interaction.reply({ content: `✅ ${member.user.tag} has been timed out for ${duration} minutes.`, ephemeral: false });

    // Log embed
    const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);
    if (logChannel) {
      const embed = new EmbedBuilder()
        .setTitle('Member Timed Out')
        .setColor('Orange')
        .addFields(
          { name: 'Member', value: `${member.user.tag} (${member.id})`, inline: true },
          { name: 'Moderator', value: `${moderator.tag}`, inline: true },
          { name: 'Duration', value: `${duration} minutes`, inline: true },
          { name: 'Reason', value: reason, inline: false },
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] });
    }

  } catch (error) {
    console.error(error);
    interaction.reply({ content: '❌ Could not timeout this member.', ephemeral: true });
  }
};
