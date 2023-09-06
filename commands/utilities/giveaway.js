const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Creates a giveaway!')
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('Set the giveaway name.')
        .setRequired(true)
    )

    .addStringOption((option) =>
      option
        .setName('prize')
        .setDescription('Set the giveaway prize.')
        .setRequired(true)
    )

    .addIntegerOption((option) =>
      option
        .setName('month')
        .setDescription('Set the month of the giveaway end date.')
        .setRequired(true)
        .setMaxValue(12)
        .setMinValue(1)
    )

    .addIntegerOption((option) =>
      option
        .setName('day')
        .setDescription('Set the day of the giveaway end date.')
        .setRequired(true)
        .setMaxValue(31)
        .setMinValue(1)
    )

    .addIntegerOption((option) =>
      option
        .setName('year')
        .setDescription('Set the year of the giveaway end date.')
        .setRequired(true)
        .setMinValue(2023)
    )

    .addStringOption((option) =>
      option
        .setName('description')
        .setDescription('Set the giveaway description.')
    ),
  async execute(interaction) {
    await interaction.reply({
      content: 'Creating giveaway...',
      ephemeral: true,
    });

    const name = interaction.options.getString('name');
    const prize = interaction.options.getString('prize');
    const year = interaction.options.getInteger('year');

    let month = interaction.options.getInteger('month');
    if (month < 10) {
      month = '0' + month;
    }

    let day = interaction.options.getInteger('day');
    if (day < 10) {
      day = '0' + day;
    }

    const date = new Date(year + '-' + month + '-' + day + 'T23:59:59');
    const time = date.getTime() / 1000;
    const discordTimestamp = '<t:' + time + ':R>';

    const hostName = interaction.user.username;
    const hostPicURL = interaction.user.displayAvatarURL();

    const enterButton = await new ButtonBuilder()
      .setCustomId('enter_giveaway')
      .setLabel('Enter!')
      .setStyle(ButtonStyle.Success);
    const endButton = await new ButtonBuilder()
      .setCustomId('end_giveaway')
      .setLabel('End!')
      .setStyle(ButtonStyle.Secondary);

    const row = await new ActionRowBuilder().addComponents(
      enterButton,
      endButton
    );

    if (interaction.options.getString('description') === null) {
      const response = await new EmbedBuilder()
        .setColor(0x6ab7dd)
        .setTitle(name)
        .setThumbnail(hostPicURL)
        .addFields(
          { name: 'Host', value: hostName },
          { name: 'Prize', value: prize },
          { name: 'Participants', value: '0', inline: true },
          { name: 'Ends', value: discordTimestamp, inline: true }
        );

      await interaction.channel.send({
        embeds: [response],
        components: [row],
      });
    } else {
      const description = interaction.options.getString('description');

      const response = await new EmbedBuilder()
        .setColor(0x6ab7dd)
        .setTitle(name)
        .setThumbnail(hostPicURL)
        .setDescription(description)
        .addFields(
          { name: 'Host', value: hostName },
          { name: 'Prize', value: prize },
          { name: 'Participants', value: '0', inline: true },
          { name: 'Ends', value: discordTimestamp, inline: true }
        );

      await interaction.channel.send({
        embeds: [response],
        components: [row],
      });
    }
  },
};
