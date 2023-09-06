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
          if (
            interaction.user.username ===
            interaction.message.embeds[0].fields[0].value
          )
            return interaction.reply({
              content: 'You are the giveaway host!',
              ephemeral: true,
            });

          const oldEmbed = interaction.message.embeds[0];

          const fields = oldEmbed.fields;
          fields[2].value = String(Number(fields[2].value) + 1);

          const newEmbed = EmbedBuilder.from(oldEmbed).setFields(fields);

          interaction.message.edit({ embeds: [newEmbed] });
          interaction.reply({
            content: 'You have entered the giveaway!',
            ephemeral: true,
          });
        }

        if (interaction.customId === 'end_giveaway') {
          if (
            interaction.user.username !==
            interaction.message.embeds[0].fields[0].value
          )
            return interaction.reply({
              content: 'You are not the giveaway host!',
              ephemeral: true,
            });

          const oldEmbed = interaction.message.embeds[0];

          const fields = oldEmbed.fields;
          fields[3].value = 'Ended';

          const newEmbed = EmbedBuilder.from(oldEmbed).setFields(fields);

          interaction.message.edit({ embeds: [newEmbed], components: [] });
        }
      }
    } catch (error) {
      console.error('[ERROR] ', error);
    }
  },
};
