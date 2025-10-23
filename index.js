// index.js
// --------
// Idaho State Roleplay Utilities Bot - Modular Version
// Author: ChatGPT + [Your Name]
// Description: Main entry point that loads commands and handles Discord events.

import fs from 'fs';                      // For reading command files
import path from 'path';                  // For file paths
import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';
import 'dotenv/config';                   // Loads environment variables from .env

// Create a new Discord client with the necessary "intents"
// Intents tell Discord what kind of events your bot should receive
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,              // Server-related events (e.g., slash commands)
    GatewayIntentBits.GuildMembers,        // Detect when members join/leave
    GatewayIntentBits.GuildMessages,       // Message-related events
    GatewayIntentBits.MessageContent,      // Read message content (use carefully)
    GatewayIntentBits.GuildMessageReactions // Detect message reactions
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction], // Allow handling partial data (useful for reactions)
});

// Create a collection (like a map) to store commands
client.commands = new Collection();

// ----- Load Commands Dynamically -----
const commandsPath = path.join(process.cwd(), 'commands');             // Path to the commands folder
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // Get all .js files

// Import and register all commands
for (const file of commandFiles) {
  const command = await import(`./commands/${file}`); // Import the command file
  client.commands.set(command.data.name, command);    // Store command in the bot's collection
}

// ----- Bot Ready Event -----
client.once('clientReady', () => {
  console.log(`✅ Logged in as ${client.user.tag}`); // Log bot status to console
  client.user.setActivity('Idaho State Roleplay', { type: 3 }); // Sets bot status: "Watching Idaho State Roleplay"
});

// ----- Interaction (Slash Command) Event -----
client.on('interactionCreate', async (interaction) => {
  // Only respond to slash commands
  if (!interaction.isChatInputCommand()) return;

  // Get the command from our collection
  const command = client.commands.get(interaction.commandName);
  if (!command) return; // If not found, exit

  try {
    // Execute the command
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    // Respond with a friendly error message
    await interaction.reply({
      content: '⚠️ There was an error while executing this command.',
      ephemeral: true, // Only visible to the user who ran it
    });
  }
});

// ----- Login -----
client.login(process.env.TOKEN); // Logs the bot in using your token in .env
