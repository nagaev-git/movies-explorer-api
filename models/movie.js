const mongoose = require("mongoose");
const { isURL } = require("validator");

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: [true, "Поле 'country' должно быть заполнено."],
    },
    director: {
      type: String,
      required: [true, "Поле 'director' должно быть заполнено."],
    },
    duration: {
      type: Number,
      required: [true, "Поле 'duration' должно быть заполнено."],
    },
    year: {
      type: String,
      required: [true, "Поле 'year' должно быть заполнено."],
    },
    description: {
      type: String,
      required: [true, "Поле 'description' должно быть заполнено."],
    },
    image: {
      type: String,
      required: [true, "Поле 'image' должно быть заполнено."],
      validate: {
        validator: (v) => isURL(v),
        message: "Поле 'image' не соответствует требуемому формату URL",
      },
    },
    trailer: {
      type: String,
      required: [true, "Поле 'trailer' должно быть заполнено."],
      validate: {
        validator: (v) => isURL(v),
        message: "Поле 'trailer' не соответствует требуемому формату URL",
      },
    },
    thumbnail: {
      type: String,
      required: [true, "Поле 'thumbnail' должно быть заполнено."],
      validate: {
        validator: (v) => isURL(v),
        message: "Поле 'thumbnail' не соответствует требуемому формату URL",
      },
    },
    owner: {
      type: mongoose.ObjectId,
      ref: "user",
      required: [true, "Поле 'owner' должно быть заполнено."],
    },
    movieId: {
      type: mongoose.ObjectId,
      ref: "movie",
      required: [true, "Поле 'movie_id' должно быть заполнено."],
    },
    nameRU: {
      type: String,
      required: [true, "Поле 'name_ru' должно быть заполнено."],
    },
    nameEN: {
      type: String,
      required: [true, "Поле 'name_en' должно быть заполнено."],
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model("movie", movieSchema);
