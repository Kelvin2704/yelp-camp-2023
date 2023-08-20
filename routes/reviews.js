const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
const reviews = require("../controllers/reviews");
// const ExpressError = require("../utils/ExpressError");
// const Campground = require("../models/campground");
// const Review = require("../models/review");

router.post("/", isLoggedIn, validateReview, wrapAsync(reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviews.deleteReview)
);

module.exports = router;
