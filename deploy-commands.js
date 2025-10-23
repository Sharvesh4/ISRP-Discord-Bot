// Command registration script for Idaho State Roleplay Utilities
import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import 'dotenv/config';

// Add your bot's client ID and your test server ID:
const CLIENT_ID = '1430786849030541374';
const GUILD_ID = '1411987240380403744';

// Define commands
const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  // More commands will go here soon
].map(command => command.toJSON());

// Register commands
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('🛠️ Registering slash commands...');
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log('✅ Slash commands registered successfully!');
  } catch (error) {
    console.error('❌ Error registering commands:', error);
  }
})();
