// warn.js
// --------
// Slash command to warn a member (DM only, logged to staff channel)

import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('warn')
  .setDescription('Warn a member')
  .addUserOption(option =>
    option.setName('target')
      .setDescription('The member to warn')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('reason')
      .setDescription('Reason for warning')
      .setRequired(true))
  .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers);

export const execute = async (interaction) => {
  const member = interaction.options.getMember('target');
  const reason = interaction.options.getString('reason');
  const moderator = interaction.user;
  const LOG_CHANNEL_ID = 'YOUR_LOG_CHANNEL_ID';

  if (!member) return interaction.reply({ content: '⚠️ Member not found.', ephemeral: true });

  try {
    // DM the member
    await member.send(`⚠️ You have been warned in **${interaction.guild.name}** by ${moderator.tag} for: ${reason}`).catch(() => null);

    await interaction.reply({ content: `✅ ${member.user.tag} has been warned.`, ephemeral: false });

    // Log embed
    const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);
    if (logChannel) {
      const embed = new EmbedBuilder()
        .setTitle('Member Warned')
        .setColor('Yellow')
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
    interaction.reply({ content: '❌ Could not warn this member.', ephemeral: true });
  }
};
