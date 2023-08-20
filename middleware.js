const { campgroundSchema,reviewSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");



//creates a new middleware function called storeReturnTo which is used to save the returnTo value from the session (req.session.returnTo) to res.locals:
module.exports.storeReturnTo = (req, res, next) => {
  console.log("storeReturnTo: ", req.session.returnTo);
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.isLoggedIn = (req, res, next) => {
  // console.log("Req.user", req.user);
  if (!req.isAuthenticated()) {
    console.log("Req.originalUrl, isLoggedIn: ",req.originalUrl)
    //store req.session.returnTo value = req.originalUrl
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in first");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const message = error.details.map((ele) => ele.message).join(",");
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to access this page");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id,reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to access this page");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const message = error.details.map((ele) => ele.message).join(",");
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};