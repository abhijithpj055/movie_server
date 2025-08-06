const mongoose = require("mongoose")


const movieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        image: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
        },
        release_date: {
            type: Date,
            required: [true, "Release date is reqired"]
        },
        averageRating: {
            type: Number,
            default: 0
        },
        numberOfRatings: {
            type: Number,
            default: 0
        },
            director: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'director',
    },
    actors: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'actor',
    }],
    language: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'language',
    },

    },
    {
        timestamps: true
    }
)


const movieModel = mongoose.model("movie", movieSchema)
module.exports = movieModel
