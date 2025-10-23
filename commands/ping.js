// /commands/ping.js
// -----------------
// Basic "ping" command to test bot responsiveness.


import { SlashCommandBuilder } from 'discord.js';

// Define the command structure (its name and description)
export const data = new SlashCommandBuilder()
  .setName('ping') // Command name (used as /ping)
  .setDescription('Replies with Pong!'); // Description shown in Discord

// Define what happens when the command is run
export async function execute(interaction) {
  await interaction.reply('🏓 Pong! The bot is online and responsive.');
}
