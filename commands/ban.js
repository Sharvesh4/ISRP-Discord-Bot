// ban.js
// --------
// Slash command to ban a member from the server.

import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ban')
  .setDescription('Ban a member from the server')
  .addUserOption(option =>
    option.setName('target')
      .setDescription('The member to ban')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('reason')
      .setDescription('Reason for banning')
      .setRequired(false))
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers); // Require Ban Members permission

export const execute = async (interaction) => {
  const member = interaction.options.getMember('target');
  const reason = interaction.options.getString('reason') || 'No reason provided';
  const moderator = interaction.user;
  const LOG_CHANNEL_ID = 'YOUR_LOG_CHANNEL_ID';

  if (!member) return interaction.reply({ content: '⚠️ Member not found.', ephemeral: true });

  // Prevent banning admins
  if (member.permissions.has(PermissionFlagsBits.Administrator))
    return interaction.reply({ content: '⚠️ You cannot ban an administrator.', ephemeral: true });

  try {
    // DM the member being banned
    await member.send(`You were banned from **${interaction.guild.name}** by ${moderator.tag} for: ${reason}`).catch(() => null);

    // Ban the member
    await member.ban({ reason });

    await interaction.reply({ content: `✅ ${member.user.tag} has been banned.`, ephemeral: false });

    // Log embed
    const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);
    if (logChannel) {
      const embed = new EmbedBuilder()
        .setTitle('Member Banned')
        .setColor('DarkRed')
        .addFields(
          { name: 'Member', value: `${member.user.tag} (${member.id})`, inline: true },
          { name: 'Moderator', value: `${moderator.tag}`, inline: true },
          { name: 'Reason', value: reason, inline: false },
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] });
    }

  } catch (error) {
    console.error(error);
    interaction.reply({ content: '❌ Could not ban this member.', ephemeral: true });
  }
};
