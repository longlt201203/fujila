const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');
const { token } = require('./config.json');

console.log(token);

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	if (interaction.commandName == "chat") {
		const file1 = interaction.options.getAttachment("file1");
		const file2 = interaction.options.getAttachment("file2");
		const file3 = interaction.options.getAttachment("file3");

		const modal = new ModalBuilder()
			.setCustomId("chatForm")
			.setTitle("Chat with Fujila");

		const messageInput = new TextInputBuilder()
			.setCustomId("msg")
			.setLabel("Message")
			.setStyle(TextInputStyle.Paragraph);

		const file1Input = new TextInputBuilder()
			.setCustomId("file1")
			.setLabel("File 1")
			.setStyle(TextInputStyle.Short)
			.setValue(file1?.url || "")
			.setRequired(false);

		const file2Input = new TextInputBuilder()
			.setCustomId("file2")
			.setLabel("File 2")
			.setStyle(TextInputStyle.Short)
			.setValue(file2?.url || "")
			.setRequired(false);

		const file3Input = new TextInputBuilder()
			.setCustomId("file3")
			.setLabel("File 3")
			.setStyle(TextInputStyle.Short)
			.setValue(file3?.url || "")
			.setRequired(false);

		const messageActionRow = new ActionRowBuilder().addComponents(messageInput);
		const file1ActionRow = new ActionRowBuilder().addComponents(file1Input);
		const file2ActionRow = new ActionRowBuilder().addComponents(file2Input);
		const file3ActionRow = new ActionRowBuilder().addComponents(file3Input);

		modal.addComponents(messageActionRow, file1ActionRow, file2ActionRow, file3ActionRow);

		await interaction.showModal(modal);
	} else {
		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	}
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isModalSubmit()) return;

	let command = null;
	if (interaction.customId == "chatForm") {
		command = interaction.client.commands.get("chat");
	}

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);