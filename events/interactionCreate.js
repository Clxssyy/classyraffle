const {
  Events,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require('discord.js');

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
          fields[4].value = String(Number(fields[4].value) + 1);

          const newEmbed = await EmbedBuilder.from(oldEmbed).setFields(fields);

          await interaction.message.edit({ embeds: [newEmbed] });
          return interaction.reply({
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
          fields[5].value = 'Ended';

          const newEmbed = await EmbedBuilder.from(oldEmbed).setFields(fields);

          const pickWinnerButton = await new ButtonBuilder()
            .setCustomId('pick_winner')
            .setLabel('Pick Winner!')
            .setStyle(ButtonStyle.Success);

          const row = await new ActionRowBuilder().addComponents(
            pickWinnerButton
          );

          if (oldEmbed.fields[4].value === '0') {
            await interaction.message.edit({
              embeds: [newEmbed],
              components: [],
            });
            return interaction.reply({
              content: 'No one entered the giveaway!',
              ephemeral: true,
            });
          }

          await interaction.message.edit({
            embeds: [newEmbed],
            components: [row],
          });

          return interaction.reply({
            content: 'Giveaway ended! Now pick a winner!',
            ephemeral: true,
          });
        }

        if (interaction.customId === 'pick_winner') {
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
          fields[2].value = 'You!';

          const newEmbed = await EmbedBuilder.from(oldEmbed).setFields(fields);

          await interaction.message.edit({
            embeds: [newEmbed],
            components: [],
          });
          return interaction.reply({
            content: 'Winner picked!',
            ephemeral: true,
          });
        }
      }
    } catch (error) {
      console.error('[ERROR] ', error);
    }
  },
};
