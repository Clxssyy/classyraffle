const { model, Schema } = require('mongoose');

const giveawaySchema = new Schema({
  guildID: String,
  messageID: String,
  startAt: Number,
  endAt: Number,
  ended: Boolean,
  winnerCount: Number,
  prize: String,
  hostedBy: String,
  winners: Array,
});

module.exports = model('giveaways', giveawaySchema);
