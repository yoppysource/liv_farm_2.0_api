const mongoose = require("mongoose");
const openingHourSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: "openingHour",
    enum: ["openingHour"],
  },
  isOpenSaturday: {
    type: Boolean,
    default: false,
  },
  isOpenSunday: {
    type: Boolean,
    default: false,
  },
  isOpenToday: {
    type: Boolean,
    default: true,
  },
  openHourStr: {
    type: String,
    default: "09:00",
  },
  closeHourStr: {
    type: String,
    default: "18:00",
  },
});

const OpeningHour = mongoose.model("openingHour", openingHourSchema);

module.exports = OpeningHour;
