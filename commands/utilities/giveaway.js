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
        .setName('date')
        .setDescription('Set the giveaway end time.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('prize')
        .setDescription('Set the giveaway prize.')
        .setRequired(true)
    ),
  async execute(interaction) {
    const name = interaction.options.getString('name');
    const prize = interaction.options.getString('prize');
    const date = interaction.options.getString('date');

    const enterButton = await new ButtonBuilder()
      .setCustomId('enter_giveaway')
      .setLabel('Enter!')
      .setStyle(ButtonStyle.Success);
    const endButton = await new ButtonBuilder()
      .setCustomId('end_giveaway')
      .setLabel('End!')
      .setDisabled(true)
      .setStyle(ButtonStyle.Secondary);

    const row = await new ActionRowBuilder().addComponents(
      enterButton,
      endButton
    );

    const hostName = interaction.user.username;
    const hostPicURL = interaction.user.displayAvatarURL();

    const response = await new EmbedBuilder()
      .setColor(0x6ab7dd)
      .setTitle(name)
      .setThumbnail(hostPicURL)
      .setDescription(
        `Giveaway Host: ${hostName}
        \nPrize: ${prize}
        \nEnd Date: ${date}`
      );

    await interaction.channel.send({
      embeds: [response],
      components: [row],
    });
  },
};
