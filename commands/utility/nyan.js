const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nyan')
		.setDescription('Nyan Nyan!'),
	/**
	 * 
	 * @param {import("discord.js").ChatInputCommandInteraction} interaction 
	 */
	async execute(interaction) {
		await interaction.deferReply();
		await interaction.editReply('Nyan!');
	},
};
