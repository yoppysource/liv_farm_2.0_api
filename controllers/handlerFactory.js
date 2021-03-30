const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("No Document found with that ID", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      //new updated data will be returned
      // mongoose.Schema 에서 설정한 벨리데이터가 작동한다.
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.productId) filter = { id: req.params.productId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .fillter()
      .sort()
      .limitFields()
      .paginate();
    //   "totalDocsExamined": 9 인덱스로 해결하기.
    // const docs = await features.query.explain();
    const docs = await features.query;
    //여기서는 error 던지지 않는다. 실제로 받았고 쿼리에서 찾았는데 안나온거는 에러가 볼 수 없음
    res.status(200).json({
      status: "success",
      results: docs.length,
      //when sending arrary
      data: {
        //생략가능. key과 value변수명이 같으면 생략가능
        data: docs,
      },
    });
  });
