const Campground = require("../models/campground");
const mapboxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mapboxGeocoding({ accessToken: mapBoxToken });

const { cloudinary } = require("../cloudinary/index");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};
module.exports.createCampground = async (req, res) => {
  // if (!req.body.campground)
  //   throw new ExpressError("Invalid Campground Data", 400);

  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();

  const campground = new Campground(req.body.campground); //campground[title] ...
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  campground.author = req.user._id;
  await campground.save();
  console.log(campground);
  req.flash("success", "Successfully made a new campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    //populate a reviews from campground and the author of that reviews
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    //populate author of that campground
    .populate("author");
  console.log(campground);

  if (!campground) {
    req.flash("error", "Can not find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.editCampground = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  campground.images.push(...images); //push all object in images arr into campground.images
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    //pull out images from images array that have filename is same with filename in deleteImages arr
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    console.log(campground);
  }
  req.flash("success", "Successfully updated campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground");

  res.redirect("/campgrounds");
};
