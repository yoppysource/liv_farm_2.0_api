const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema({
  imageUrl: String,
  url: String,
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
