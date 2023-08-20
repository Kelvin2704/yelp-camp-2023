const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const wrapAsync = require("../utils/wrapAsync");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

router
  .route("/")
  .get(campgrounds.index)
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    wrapAsync(campgrounds.createCampground)
  );
// .post(upload.array('image'),function(req,res){
//   res.send("It worked?")
//   console.log(req.body,req.files);
// })

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    wrapAsync(campgrounds.editCampground)
  )
  .delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCampground));

//render edit campgrounds
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    console.log(campground);
    if (!campground) {
      req.flash("error", "Can not find that campground");
      return res.redirect("/campgrounds");
    }

    res.render("campgrounds/edit", { campground });
  })
);
//edit campground when hit the button update

module.exports = router;
