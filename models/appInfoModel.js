const mongoose = require("mongoose");
const appInfoSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: "appInfo",
    enum: ["appInfo"],
  },
  version: String,
  inMaintenance: Boolean,
  streamingTag: String,
});

const AppInfo = mongoose.model("appInfo", appInfoSchema);

module.exports = AppInfo;
