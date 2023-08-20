const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", () => {
  console.log("Db connected");
});
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDb = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      author: "64c775b0fffdbc74f9925b52",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel doloremque nihil voluptatibus illum animi fuga error, non aut perspiciatis nostrum ab quisquam voluptatem ipsam laboriosam temporibus cum! Corrupti, distinctio enim.",
      price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dx8cwnjge/image/upload/v1692099407/YelpCamp/camping_tent_1_jlpsve.jpg",
          filename: "YelpCamp/camping_tent_1_jlpsve",
        },
        {
          url: "https://res.cloudinary.com/dx8cwnjge/image/upload/v1692099406/YelpCamp/river_mountain_jic5au.jpg",
          filename: "YelpCamp/river_mountain_jic5au",
        },
      ],
    });
    await camp.save();
  }
};

seedDb().then(() => db.close());
