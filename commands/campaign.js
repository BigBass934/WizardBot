/* eslint-disable no-trailing-spaces */
/* eslint-disable spaced-comment */
/* eslint-disable no-inline-comments */
/* eslint-disable indent */
const { SlashCommandBuilder, ChannelType, EmbedBuilder, FormattingPatterns, Options } = require('discord.js');
const fs = require('fs');

function createNewQuest(new_interaction) {
    const campaign_Name = new_interaction.options.getString('campaign_name');
    const campaign_Description = new_interaction.options.getString('campaign_description');
    const campaign_GM = new_interaction.options.getUser('campaign_gm');
    const campaign_GM_Tag = campaign_GM.tag;
    const campaign_GM_ID = campaign_GM.id;
    const campaign_GM_Username = campaign_GM.username;
    const campaign_Game_System = new_interaction.options.getString('campaign_game_system');
    const campaign_Roll20_Link = new_interaction.options.getString('campaign_roll20_link');
    
    const data = fs.readFileSync('campaigns.json');
    const myObject = JSON.parse(data);

    const choices = [];
    let matching_name = 0;
    for (let i = 0; i < myObject.length; i++) {
        const curObject = myObject[i];
        // console.log(curObject);
        choices.push(curObject.campaignName);
        if (curObject.campaignName == campaign_Name) {
            matching_name = 1;
        }
    }
    if (matching_name == 1) {
        return `ERROR: New Campaign: [ ${campaign_Name} ] creation FAILED! \n The name [ ${campaign_Name} ] is already taken by another campaign. My Library of Lore has no room for duplicates!`;
    }

    if (campaign_GM_Tag == 'WizardBot#5653') {
        return `ERROR: New Campaign: [ ${campaign_Name} ] creation FAILED! \n I (WizardBot) cannot be made the GM of a campaign - I'm a Wizard for gods' sake! Please choose another user to be your GM.`;
    }

    const newData = {
        id: myObject.length + 1,
        campaignName: campaign_Name,
        campaignDescription: campaign_Description,
        campaignGM_ID: campaign_GM_ID,
        campaignGM_Tag: campaign_GM_Tag,
        campaignGM_Username: campaign_GM_Username,
        campaignGameSystem: campaign_Game_System,
        campaignRoll20Link: campaign_Roll20_Link,
        campaignMainTextChannels: {
            campaignPartyQuestChannel: {
                id: 'null',
                name: 'null',
            },
            campaignPersonalQuestChannel: {
                id: 'null',
                name: 'null',
            },
            campaignCharIntrosChannel: {
                id: 'null',
                name: 'null',
            },
        },
        campaignMainVoiceChatID: '',
        campaignWorldInfoTextChannels: {
            campaignMapsChannel: {
                id: 'null',
                name: 'null',
            },
            campaignGuildsFactionsChannel: {
                id: 'null',
                name: 'null',
            },
            campaignGodsDeitiesChannelID: {
                id: 'null',
                name: 'null',
            },
            campaignWorldEventsLoreChannelID: {
                id: 'null',
                name: 'null',
            },
        },
        
    };



    myObject.push(newData);

    const newData2 = JSON.stringify(myObject);
    fs.writeFile('campaigns.json', newData2, (err) => {
        // Error Checking
        if (err) throw err;
        console.log('New data added');
    });

    
    return `New Campaign: ${campaign_Name} successfully created! \n@${campaign_GM_Tag} is now the current GM for it.`;
}

function editCurQuest(new_interaction) {
    // First, get all inputted option values
    const campaign_To_Edit_Name = new_interaction.options.getString('campaign_to_edit');
    const updated_campaign_Name = new_interaction.options.getString('updated_campaign_name');
    const updated_campaign_Description = new_interaction.options.getString('updated_campaign_description');
    const updated_campaign_GM = new_interaction.options.getUser('updated_campaign_gm');
    const updated_campaign_GM_Tag = updated_campaign_GM.tag;
    const updated_campaign_GM_ID = updated_campaign_GM.id;
    const updated_campaign_GM_Username = updated_campaign_GM.username;
    const updated_campaign_Game_System = new_interaction.options.getString('updated_campaign_gs');
    const updated_campaign_Roll20_Link = new_interaction.options.getString('updated_campaign_roll20_link');

    // Next, open up & Parse the campaigns JSON file
    const data = fs.readFileSync('campaigns.json');
    const myObject = JSON.parse(data);
    
    // Initialize the dict that will store the messages to display back to the user.
    let editMsgs = {
        foundCampaign: 0, // Campaign to-edit is currently not found (0)
        campaignNameUpdate: '', 
        campaignDescUpdate: '',
        campaignGMUpdate: '',
        campaignGSUpdate: '',
        campaignRoll20Update: '',
    };

    for (let i = 0; i < myObject.length; i++) {
        const curObject = myObject[i];
        if (curObject.campaignName === campaign_To_Edit_Name) {
            editMsgs.foundCampaign = 1; // If the current object's campaign name is the same as the one specified by the player, foundCampaign == true
            // Campaign Name Update
            if (updated_campaign_Name != curObject.campaignName && updated_campaign_Name != 'null') {
                const oldCampaignName = curObject.campaignName;
                curObject.campaignName = updated_campaign_Name; // If the user's new name isn't exactly the same, and isn't 'null', update the name.
                editMsgs.campaignNameUpdate = `Campaign Name Update | Status: SUCCESS | Condition: VALUE CHANGED | Old Value: ${oldCampaignName} | New Value: ${curObject.campaignName}`;
            } else if (updated_campaign_Name == curObject.campaignName) {
                    editMsgs.campaignNameUpdate = `Campaign Name Update | Status: FAILURE | Condition: VALUE UNCHANGED | Old Value: ${curObject.campaignName} | New Value: ${curObject.campaignName} \n    
                    ERROR: You cannot update a Campaign's name to the exact same text it currently is!`;
                } else {
                    editMsgs.campaignNameUpdate = `Campaign Name Update | Status: SUCCESS | Condition: VALUE UNCHANGED | Old Value: ${curObject.campaignName} | New Value: ${curObject.campaignName}`;
                }
            // Campaign Description Update
            if (updated_campaign_Description != curObject.campaignDescription && updated_campaign_Description != 'null') {
                const oldCampaignDesc = curObject.campaignDescription;
                curObject.campaignDescription = updated_campaign_Description; // If the user's new desc isn't exactly the same, and isn't 'null', update the description.
                editMsgs.campaignDescUpdate = `Campaign Description Update | Status: SUCCESS | Condition: VALUE CHANGED | Old Value: ${oldCampaignDesc} | New Value: ${curObject.campaignDescription}`;
                
            } else if (updated_campaign_Description == curObject.campaignDescription) {
                editMsgs.campaignDescUpdate = `Campaign Description Update | Status: FAILURE | Condition: VALUE UNCHANGED | Old Value: ${curObject.campaignDescription} | New Value: ${curObject.campaignDescription}    
                ERROR: You cannot update a Campaign's description to the exact same text it currently is!`;
            } else { 
                editMsgs.campaignDescUpdate = `Campaign Description Update | Status: SUCCESS | Condition: VALUE UNCHANGED | Old Value: ${curObject.campaignDescription} | New Value: ${curObject.campaignDescription}`;
            }
            // Campaign GM Update
            if (updated_campaign_GM_Tag != curObject.campaignGM_Tag && updated_campaign_GM_Tag != 'WizardBot#5653') { // If the new gm's tag doesn't match the current one, update the campaign GM information.
                const oldCampaignGM_Tag = curObject.campaignGM_Tag;
                curObject.campaignGM_ID = updated_campaign_GM_ID;
                curObject.campaignGM_Tag = updated_campaign_GM_Tag;
                curObject.campaignGM_Username = updated_campaign_GM_Username;
                editMsgs.campaignGMUpdate = `Campaign GM Update | Status: SUCCESS | Condition: VALUE CHANGED | Old Value: ${oldCampaignGM_Tag} | New Value: ${curObject.campaignGM_Tag}`;
            } else if (updated_campaign_GM_Tag == curObject.campaignGM_Tag && updated_campaign_GM_Tag != 'WizardBot#5653') {
                    editMsgs.campaignGMUpdate = `Campaign GM Update | Status: FAILURE | Condition: VALUE UNCHANGED | Old Value: ${curObject.campaignGM_Tag} | New Value: ${curObject.campaignGM_Tag}    
                    ERROR: You cannot update a Campaign's GM to the exact same user it currently is!`;
                    } else {
                        editMsgs.campaignGMUpdate = `Campaign GM Update | Status: SUCCESS | Condition: VALUE UNCHANGED | Old Value: ${curObject.campaignGM_Tag} | New Value: ${curObject.campaignGM_Tag}`;
                    }
            // Campaign Game System Update
            if (updated_campaign_Game_System != curObject.campaignGameSystem) { // If the new game system doesn't match the current one, update the game system info.
                const oldCampaignGS = curObject.campaignGameSystem;
                curObject.campaignGameSystem = updated_campaign_Game_System;
                editMsgs.campaignGSUpdate = `Campaign Game System Update | Status: SUCCESS | Condition: VALUE CHANGED | Old Value: ${oldCampaignGS} | New Value: ${curObject.campaignGameSystem}`;
            } else {
                editMsgs.campaignGSUpdate = `Campaign Game System Update | Status: SUCCESS | Condition: VALUE UNCHANGED | Old Value: ${curObject.campaignGameSystem} | New Value: ${curObject.campaignGameSystem}`;
            }
            // Campaign Roll20 Link Update
            if (updated_campaign_Roll20_Link != curObject.campaignRoll20Link && updated_campaign_Roll20_Link != 'null') { 
                const oldCampaignRoll20Link = curObject.campaignRoll20Link;
                curObject.campaignRoll20Link = updated_campaign_Roll20_Link; // If the new roll20 link doesn't match the current one, update the roll20 link.
                editMsgs.campaignRoll20Update = `Campaign Roll20 Link Update | Status: SUCCESS | Condition: VALUE CHANGED | Old Value: ${oldCampaignRoll20Link} | New Value: ${curObject.campaignRoll20Link}`;
            } else if (updated_campaign_Roll20_Link == curObject.campaignRoll20Link) {
                    editMsgs.campaignRoll20Update = `Campaign Roll20Link Update | Status: FAILURE | Condition: VALUE UNCHANGED | Old Value: ${curObject.campaignRoll20Link} | New Value: ${curObject.campaignRoll20Link}    
                    ERROR: You cannot update a Campaign's Roll20 Link to the exact same one it currently is!`;
                } else {
                    editMsgs.campaignGMUpdate = `Campaign Roll20 Link Update | Status: SUCCESS | Condition: VALUE UNCHANGED | Old Value: ${curObject.campaignRoll20Link} | New Value: ${curObject.campaignRoll20Link}`;
                }
        }
    }
    // Write the JSON object back to the JSON file.
    const newData2 = JSON.stringify(myObject);
    fs.writeFile('campaigns.json', newData2, (err) => {
        // Error Checking
        if (err) throw err;
        console.log('New data added');
    });
    // Return the editMsgs dict back to the original thing.
    if (editMsgs.foundCampaign == 0) {
        return 'ERROR: For some unspecified reason, the specified campaign is not registered in my Library of Lore. Please try again later!';
    } else {
        // const returnMsg = '';
        // returnMsg.concat(editMsgs.campaignNameUpdate, '\n', editMsgs.campaignDescUpdate, '\n', editMsgs.campaignGMUpdate, 
        //     '\n', editMsgs.campaignGSUpdate, '\n', editMsgs.campaignRoll20Update);
        const returnMsg = editMsgs.campaignNameUpdate + '\n' + editMsgs.campaignDescUpdate + '\n' + editMsgs.campaignGMUpdate +
        '\n' + editMsgs.campaignGSUpdate + '\n' + editMsgs.campaignRoll20Update;
        console.log(returnMsg);
        return returnMsg;
    }
}

function setPartyQuestsChannel(new_interaction) {
    // First, get the associated campaign and list of channels from your interaction
    const associated_campaign = new_interaction.options.getString('associated_campaign');
    const campaignChannelType = new_interaction.options.getString('campaign_channel_type');
    const channel = new_interaction.options.getChannel('pq_channel_selection');

    // Next, open up & Parse the campaigns JSON file
    const data = fs.readFileSync('campaigns.json');
    const myObject = JSON.parse(data);

    let foundCampaign = 0;

    for (let i = 0; i < myObject.length; i++) {
        const curObject = myObject[i];
        if (curObject.campaignName === associated_campaign) {
            foundCampaign = 1; // If the current object's campaign name is the same as the one specified by the player, foundCampaign == true
            if (campaignChannelType == 'Character Introductions') {
                curObject.campaignMainTextChannels.campaignCharIntrosChannel.id = channel.id;
                curObject.campaignMainTextChannels.campaignCharIntrosChannel.name = channel.name;
            } 
            else if (campaignChannelType == 'Gods and Deities Info') {
                curObject.campaignMainTextChannels.campaignGodsDeitiesChannel.id = channel.id;
                curObject.campaignMainTextChannels.campaignCGodsDeitiesChannel.name = channel.name;
            }
            else if (campaignChannelType == 'Maps') {
                curObject.campaignMainTextChannels.campaignMapsChannel.id = channel.id;
                curObject.campaignMainTextChannels.campaignMapsChannel.name = channel.name;
            }
            //'Maps', 'Party Quests', 'Personal Quests', 'World Events and Lore Info'
            else if (campaignChannelType == 'Party Quests') {
                curObject.campaignMainTextChannels.campaignPartyQuestChannel.id = channel.id;
                curObject.campaignMainTextChannels.campaignPartyQuestChannel.name = channel.name;
            }
            else if (campaignChannelType == 'Personal Quests') {
                curObject.campaignMainTextChannels.campaignPersonalQuestChannel.id = channel.id;
                curObject.campaignMainTextChannels.campaignPersonalQuestChannel.name = channel.name;
            }
            else if (campaignChannelType == 'World Events and Lore Info') {
                curObject.campaignMainTextChannels.campaignWorldEventsLoreChannel.id = channel.id;
                curObject.campaignMainTextChannels.campaignWorldEventsLoreChannel.name = channel.name;
            }
        }
    }
    if (foundCampaign != 1) {
        return 'Campaign Not Found!';
    } else {
        // Write the JSON object back to the JSON file.
        const newData2 = JSON.stringify(myObject);
        fs.writeFile('campaigns.json', newData2, (err) => {
            // Error Checking
            if (err) throw err;
            console.log('New data added');
        });
        return `Successfully set #${channel.name} as the dedicated ${campaignChannelType} channel for ${associated_campaign}`;
    }
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('campaign')
		.setDescription('Epic Command Suite for Campaigns - [NOTE: GM ROLE PERMISSIONS ARE REQUIRED BEFORE USING THESE]')
		
        // Create Command
        .addSubcommand(subCommand =>
			subCommand
				.setName('create')
				.setDescription('Create & Register a new Campaign in the backend.')
				.addStringOption(option =>
					option.setName('campaign_name')
						.setDescription('The name of the new campaign')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('campaign_description')
                        .setDescription('Description or Flavor Text for the new campaign.')
                        .setRequired(true))
                .addUserOption(option =>
                    option.setName('campaign_gm')
                        .setDescription('Who is the GM for this campaign?')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('campaign_game_system')
                        .setDescription('What TTRPG game/system is this game utilizing?')
                        .setRequired(true)
                        .setAutocomplete(true))
                .addStringOption(option =>
                    option.setName('campaign_roll20_link')
                        .setDescription('This is the sharing/invite link to the campaign\'s Roll20 room.')))
        
        // Print Command
        .addSubcommand(subCommand =>
            subCommand
                .setName('print')
                .setDescription('print out something idk'))
        
        // Edit Command
        .addSubcommand(subCommand =>
            subCommand
                .setName('edit')
                .setDescription('Edit the registered info of a preexisting campaign.')
                .addStringOption(option =>
                    option.setName('campaign_to_edit')
                        .setDescription('Which campaign do you want to edit information for?')
                        .setRequired(true)
                        .setAutocomplete(true))
                .addStringOption(option =>
					option.setName('updated_campaign_name')
						.setDescription('The new name you wish to give to this campaign')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('updated_campaign_description')
                        .setDescription('The new Description or Flavor Text you wish to give to this campaign.')
                        .setRequired(true))
                .addUserOption(option =>
                    option.setName('updated_campaign_gm')
                        .setDescription('Who is the updated/new GM for this campaign?')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('updated_campaign_gs')
                        .setDescription('What TTRPG game/system will this game now be utilizing?')
                        .setRequired(true)
                        .setAutocomplete(true))
                .addStringOption(option =>
                    option.setName('updated_campaign_roll20_link')
                        .setDescription('The updated sharing/invite link to the campaign\'s Roll20 room.')
                        .setRequired(true)))
        
        // Set Party Quests Channel Command
        .addSubcommand(subCommand =>
            subCommand
                .setName('set_channel')
                .setDescription('Set channels for a specific campaign, such as a party quests channel, maps channel, etc.')
                .addStringOption(option =>
                    option.setName('associated_campaign')
                        .setDescription('Which campaign do you want to set a new party quests channel for?')
                        .setRequired(true)
                        .setAutocomplete(true))
                .addStringOption(option => 
                    option.setName('campaign_channel_type')
                        .setDescription('Which channel type are you going to be setting?')
                        .setRequired(true)
                        .setAutocomplete(true))
                .addChannelOption(option =>
                    option.setName('pq_channel_selection')
                        .setDescription('Which channel in this server would you like to set as the [channel type here] channel?')
                        .setRequired(true))),

    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);
        let choices;

        if (focusedOption.name === 'campaign_game_system' || focusedOption.name === 'updated_campaign_gs') {
            choices = ['CopperHorse', 'Advanced Dungeons & Dragons', 'Dungeons & Dragons 3rd Edition', 'Dungeons & Dragons v.3.5', 'Pathfinder', 'Starfinder', 'Dungeons & Dragons 4th Edition', 'Dungeons & Dragons 5th Edition', 'One D&D', 'Warhammer 40,000: Dark Heresy - 1st Edition', 'Warhammer 40,000: Dark Heresy - 2nd Edition', 'Warhammer 40,000: Rogue Trader', 'Warhammer 40,000: Deathwatch', 'Warhammer 40,000: Black Crusade', 'Warhammer 40,000: Only War', 'Warhammer 40,000: Wrath & Glory - 1st Edition', 'Warhammer 40,000: Wrath & Glory - 2nd Edition'];
        }

        if (focusedOption.name === 'campaign_to_edit' || focusedOption.name === 'associated_campaign') {
            choices = [];
            const data = fs.readFileSync('campaigns.json');
            const myObject = JSON.parse(data);
            for (let i = 0; i < myObject.length; i++) {
                const curObject = myObject[i];
                // console.log(curObject);
                choices.push(curObject.campaignName);
            }
        }

        if (focusedOption.name === 'campaign_channel_type') {
            choices = ['Character Introductions', 'Gods and Deities Info', 'Maps', 'Party Quests', 'Personal Quests', 'World Events and Lore Info'];
        }
        const filtered = choices.filter(choice => choice.startsWith(focusedOption.value));
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    },

    async execute(interaction) {
        // Campaign 'create' Subcommand
        if (interaction.options.getSubcommand() === 'create') {
            const newCampaignMsg = createNewQuest(interaction);

            return interaction.reply(newCampaignMsg);
        } 
        // Test Subcommand, 'print'
        else if (interaction.options.getSubcommand() === 'print') {
            return interaction.reply('bruh your campaign is pretty cringe LOL');
        } 
        // Campaign 'edit' Subcommand
        else if (interaction.options.getSubcommand() === 'edit') {
            const editReturnMsg = editCurQuest(interaction);

            return interaction.reply({ content: editReturnMsg, ephemeral: true });
        }
        // Campaign 'set party quests channel' Subcommand
        else if (interaction.options.getSubcommand() === 'set_channel') {
            // const textChanNames = interaction.guild.channels.cache.filter(chan => chan.type === ChannelType.GuildText).map(chan => chan.name).sort();
            // console.log(textChanNames);
            // console.log('made it to step 1!');
            const returnMsg = setPartyQuestsChannel(interaction);
            return interaction.reply({ content: returnMsg, ephemeral: true });
        }
		return interaction.reply('Haha Funny Quest Time!');
	},
};