const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const OpeningHour = require("../models/openingHourModel");

exports.getOpeningHour = factory.getOne(OpeningHour);
exports.updateOpeningHour = factory.updateOne(OpeningHour);
exports.createOpeningHour = factory.createOne(OpeningHour);
