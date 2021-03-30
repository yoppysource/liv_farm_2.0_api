const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppInfo = require("../models/appInfoModel");

exports.getAppInfo = factory.getOne(AppInfo);
exports.updateAppInfo = factory.updateOne(AppInfo);
