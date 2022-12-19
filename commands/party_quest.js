/* eslint-disable no-trailing-spaces */
/* eslint-disable spaced-comment */
/* eslint-disable no-inline-comments */
/* eslint-disable indent */
const { SlashCommandBuilder, EmbedBuilder, FormattingPatterns } = require('discord.js');
const fs = require('fs');

function createNewQuest(new_interaction) {
    const questName = new_interaction.options.getString('quest_name');
    const questDescription = new_interaction.options.getString('quest_description');
    const questCatalyst = new_interaction.options.getString('quest_catalyst');
    const sideQuestTrue = new_interaction.options.getBoolean('side_quest');
    const initialObjective = new_interaction.options.getString('initial_objective');
    let embedColor = 0xFF001A;
    let questType = 'Main Quest';
    
    // Change the Quest Type & Embed color if the new quest is to be a Side Quest
    if (sideQuestTrue === true) {
        embedColor = 0x0099ff;
        questType = 'Side Quest';
    }
    
    // Build the new Quest's Embed
    const newQuestEmbed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle(questName)
        .setDescription(questDescription)
        .addFields(
            { name: 'Quest Catalyst', value: questCatalyst, inline: true },
            { name: 'Quest Type', value: questType, inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: 'Initial Objective', value: initialObjective },
        )
        .setFooter({ text: 'This is the footer text' });
    
    return newQuestEmbed;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('party_quest')
		.setDescription('Epic Command Suite for Quests')
		.addSubcommand(subCommand =>
			subCommand
				.setName('create')
				.setDescription('Create a new Quest')
				.addStringOption(option =>
					option.setName('quest_name')
						.setDescription('The name of the new quest')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('quest_description')
                        .setDescription('Description or Flavor Text for the new Quest')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('quest_catalyst')
                        .setDescription('What event/individual/groups, etc. set this quest in motion?')
                        .setRequired(true))
                .addBooleanOption(option =>
                    option.setName('side_quest')
                        .setDescription('Is this new quest considered a "Main Quest", or a "Side Quest"?')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('initial_objective')
                        .setDescription('What is the first objective of this quest?')
                        .setRequired(true)))
        .addSubcommand(subCommand =>
            subCommand
                .setName('print')
                .setDescription('print out something idk')),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'create') {
            // Retrieve input options
            const newQuestEmbed = createNewQuest(interaction);

            return interaction.reply({ embeds: [newQuestEmbed] });
        }
        if (interaction.options.getSubcommand() === 'print') {
            return interaction.reply('bruh you are pretty cringe LOL');
        }
		return interaction.reply('Haha Funny Quest Time!');
	},
};