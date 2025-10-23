// kick.js
// --------
// Slash command to kick a member from the server.

import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('kick')
  .setDescription('Kick a member from the server')
  .addUserOption(option =>
    option.setName('target')
      .setDescription('The member to kick')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('reason')
      .setDescription('Reason for kicking')
      .setRequired(false))
  .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers); // Require Kick Members permission

export const execute = async (interaction) => {
  const member = interaction.options.getMember('target'); // Member to kick
  const reason = interaction.options.getString('reason') || 'No reason provided';
  const moderator = interaction.user; // Who ran the command
  const LOG_CHANNEL_ID = 'YOUR_LOG_CHANNEL_ID'; // Replace with your staff log channel ID

  if (!member) return interaction.reply({ content: '⚠️ Member not found.', ephemeral: true });

  // Prevent kicking admins
  if (member.permissions.has(PermissionFlagsBits.Administrator))
    return interaction.reply({ content: '⚠️ You cannot kick an administrator.', ephemeral: true });

  try {
    // DM the member being kicked
    await member.send(`You were kicked from **${interaction.guild.name}** by ${moderator.tag} for: ${reason}`).catch(() => null);

    // Kick the member from the server
    await member.kick(reason);

    await interaction.reply({ content: `✅ ${member.user.tag} has been kicked.`, ephemeral: false });

    // Send log embed to staff channel
    const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);
    if (logChannel) {
      const embed = new EmbedBuilder()
        .setTitle('Member Kicked')
        .setColor('Red')
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
    interaction.reply({ content: '❌ Could not kick this member.', ephemeral: true });
  }
};
