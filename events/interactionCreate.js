const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand() && !interaction.isButton()) return;
    try {
      if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(
          interaction.commandName
        );

        command.execute(interaction);
      }
      if (interaction.isButton()) {
        if (interaction.customId === 'enter_giveaway') {
          const oldEmbed = interaction.message.embeds[0];

          const fields = oldEmbed.fields;
          fields[2].value = String(Number(fields[2].value) + 1);

          const newEmbed = EmbedBuilder.from(oldEmbed).setFields(fields);

          interaction.message.edit({ embeds: [newEmbed] });
        }
      }
    } catch (error) {
      console.error('[ERROR] ', error);
    }
  },
};
