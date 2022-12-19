const { Events, InteractionType } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {

			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				await interaction.reply({
					content: `ERROR: No command matching [ ${interaction.commandName} ] was found`,
					ephemeral: true,
				});
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
				await interaction.reply({
					content: `ERROR: Something went wrong while executing [ ${interaction.commandName} ]`,
					ephemeral: true,
				});
			}
		} else if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
			
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				await interaction.reply({
					content: `ERROR: No command matching [ ${interaction.commandName} ] was found`,
					ephemeral: true,
				});
				return;
			}
			
			try {
				await command.autocomplete(interaction);
			} catch (error) {
				console.error(error);
			}
		}
	},
};