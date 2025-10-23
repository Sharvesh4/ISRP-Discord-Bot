// index.js
// --------
// Idaho State Roleplay Utilities Bot - Modular Version
// Author: ChatGPT + [Your Name]
// Description: Main entry point that loads commands and handles Discord events.

import fs from 'fs';                      // For reading command files
import path from 'path';                  // For file paths
import { Client, GatewayIntentBits, Partials, Collection, ActivityType } from 'discord.js';
import 'dotenv/config';                   // Loads environment variables from .env

// ----- Create Discord Client -----
// Intents tell Discord what kind of events your bot should receive
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,              // Server-related events (e.g., slash commands)
    GatewayIntentBits.GuildMembers,        // Detect when members join/leave
    GatewayIntentBits.GuildMessages,       // Message-related events
    GatewayIntentBits.MessageContent,      // Allows reading message content (use carefully)
    GatewayIntentBits.GuildMessageReactions // Detect message reactions
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction], // Needed for reactions & uncached messages
});

// ----- Create a Collection to Store Commands -----
// Collection is like a Map object: key = command name, value = command file
client.commands = new Collection();

// ----- Dynamically Load Commands from /commands Folder -----
const commandsPath = path.join(process.cwd(), 'commands'); // Path to the commands folder
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // Only .js files

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`); // Dynamically import each command
  client.commands.set(command.data.name, command);    // Add it to the bot's collection
}

// ----- Bot Ready Event -----
client.once('ready', () => { // Changed from 'clientReady' -> 'ready' (Discord.js correct event name)
  console.log(`✅ Logged in as ${client.user.tag}`); // Log bot status
  client.user.setActivity('Idaho State Roleplay', { type: ActivityType.Watching }); // Bot status: "Watching Idaho State Roleplay"
});

// ----- Interaction Event -----
// Handles slash commands
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return; // Only respond to slash commands

  const command = client.commands.get(interaction.commandName); // Get the command
  if (!command) return; // Exit if command not found

  try {
    await command.execute(interaction); // Run the command
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: '⚠️ There was an error while executing this command.',
      ephemeral: true, // Only visible to the user who ran it
    });
  }
});

// ----- Login to Discord -----
client.login(process.env.TOKEN); // Uses token from your .env
