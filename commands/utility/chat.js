const { SlashCommandBuilder } = require('discord.js');
const openai = require('../../openai');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('chat')
		.setDescription('Chat with Fujila!')
        .addAttachmentOption(option => option.setName("file1").setDescription("Input file 1").setRequired(false))
        .addAttachmentOption(option => option.setName("file2").setDescription("Input file 2").setRequired(false))
        .addAttachmentOption(option => option.setName("file3").setDescription("Input file 3").setRequired(false)),
	/**
	 * 
	 * @param {import("discord.js").Interaction} interaction 
	 */
	async execute(interaction) {
        if (!interaction.isModalSubmit()) return;
        const msg = interaction.fields.getTextInputValue("msg");
        const file1Url = interaction.fields.getTextInputValue("file1");
        const file2Url = interaction.fields.getTextInputValue("file2");
        const file3Url = interaction.fields.getTextInputValue("file3");
        console.log(interaction.user.username + ": " + msg);
        if (file1Url) console.log(interaction.user.username + ": " + file1Url);
        if (file2Url) console.log(interaction.user.username + ": " + file2Url);
        if (file3Url) console.log(interaction.user.username + ": " + file3Url);
        if (!msg) {
            await interaction.reply({ content: "No message provided!", ephemeral: true });
        }

        interaction.deferReply({ ephemeral: true });
        const userMessage = [
            {
                type: "text",
                text: msg
            },
        ];

        if (file1Url) userMessage.push({ type: "image_url", image_url: { url: file1Url } });
        if (file2Url) userMessage.push({ type: "image_url", image_url: { url: file2Url } });
        if (file3Url) userMessage.push({ type: "image_url", image_url: { url: file3Url } });

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are an Discord chatbot named Fujila!"
                },
                {
                    role: "user",
                    content: userMessage
                }
            ]
        });
        const responseMsg = response.choices[0].message.content;
        console.log("Reply to " + interaction.user.username + ": " + responseMsg);
        await interaction.editReply({ content: responseMsg, ephemeral: true });
	},
};
