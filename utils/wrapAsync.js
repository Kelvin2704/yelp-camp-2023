function wrapAsync(asyncFn) {
  return function (req, res, next) {
    asyncFn(req, res, next).catch((e) => next(e));
  };
}

module.exports = wrapAsync;