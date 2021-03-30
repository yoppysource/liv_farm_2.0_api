const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
}; //(err) => next(err) === next

module.exports = catchAsync;
