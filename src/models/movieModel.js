const mongoose = require("mongoose")


const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  release_date: { type: Date, required: true },
  director: { type: mongoose.Schema.Types.ObjectId, ref: "director", default: null },
  actors: [{ type: mongoose.Schema.Types.ObjectId, ref: "actor" }],
  language: { type: mongoose.Schema.Types.ObjectId, ref: "language", default: null },
  rating: { type: Number, default: 0 },
  isPremium: { type: Boolean, default: false },
  image: { type: String, default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: false },
}, { timestamps: true });


const movieModel = mongoose.model("movie", movieSchema)
module.exports = movieModel
