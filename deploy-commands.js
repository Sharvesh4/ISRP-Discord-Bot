// deploy-commands.js
// ------------------
// Registers all slash commands from the "commands" folder with Discord.

import fs from 'fs';               // For reading files
import path from 'path';           // For file path resolution
import { REST, Routes } from 'discord.js'; // Discord API for registering commands
import 'dotenv/config';            // Load environment variables

// Replace with your actual IDs from the Discord Developer Portal
const CLIENT_ID = '1430786849030541374';
const GUILD_ID = '1411987240380403744'; // You can use your main or test server ID

// Create an array to hold all command definitions
const commands = [];

// Get all command files from /commands
const commandsPath = path.join(process.cwd(), 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Import each command and push it into the commands array
for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

// Connect to Discord’s API using your bot token
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// Try to register commands with the specified server
try {
  console.log('🛠️ Registering slash commands...');
  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: commands }
  );
  console.log('✅ Slash commands registered successfully!');
} catch (error) {
  console.error('❌ Error registering commands:', error);
}
