// untimeout.js
// --------
// Slash command to remove timeout from a member.

import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('untimeout')
  .setDescription('Remove timeout from a member')
  .addUserOption(option =>
    option.setName('target')
      .setDescription('The member to remove timeout from')
      .setRequired(true))
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

export const execute = async (interaction) => {
  const member = interaction.options.getMember('target');
  const moderator = interaction.user;
  const LOG_CHANNEL_ID = 'YOUR_LOG_CHANNEL_ID';

  if (!member) return interaction.reply({ content: '⚠️ Member not found.', ephemeral: true });

  try {
    await member.timeout(null, 'Timeout removed'); // remove timeout

    await interaction.reply({ content: `✅ ${member.user.tag} is no longer timed out.`, ephemeral: false });

    // Log embed
    const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);
    if (logChannel) {
      const embed = new EmbedBuilder()
        .setTitle('Member Untimed Out')
        .setColor('Green')
        .addFields(
          { name: 'Member', value: `${member.user.tag} (${member.id})`, inline: true },
          { name: 'Moderator', value: `${moderator.tag}`, inline: true },
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] });
    }

  } catch (error) {
    console.error(error);
    interaction.reply({ content: '❌ Could not remove timeout from this member.', ephemeral: true });
  }
};
