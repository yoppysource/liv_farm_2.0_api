const Klaviyo = require("node-klaviyo");
const dotenv = require("dotenv");

const KlaviyoClient = new Klaviyo({
  publicToken: process.env.EMAIL_PUBILC_KEY,
  privateToken: process.env.EMAIL_PRIVATE_KEY,
});

module.exports = KlaviyoClient;
