// Idaho State Roleplay Utilities - Base Bot Code
// Author: ChatGPT + [Your Name]
// Version: 1.0.0

// Import required libraries
import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';
import 'dotenv/config';

// Create a new Discord client with all necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Server events
    GatewayIntentBits.GuildMembers, // Member join/leave
    GatewayIntentBits.GuildMessages, // Messages
    GatewayIntentBits.MessageContent, // Read message content
    GatewayIntentBits.GuildMessageReactions // Reactions
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// When the bot is online
client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  client.user.setActivity('Idaho State Roleplay', { type: 3 }); // "Watching Idaho State Roleplay"
});

// Example command handler (we’ll expand this later)
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('🏓 Pong! The bot is online.');
  }
});

// Login using the token in .env
client.login(process.env.TOKEN);
