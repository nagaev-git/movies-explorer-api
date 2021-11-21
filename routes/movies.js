const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getMovies,
  createMovie,
  deleteMovieByID,
} = require("../controllers/movies");
const regExp = require("../regexp/regexp");

router.get("/movies", getMovies);
router.post(
  "/movies",
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().min(2).max(30).required(),
      director: Joi.string().min(2).max(30).required(),
      duration: Joi.number().min(1).max(30).required(),
      year: Joi.string().min(4).max(4).required(),
      description: Joi.string().min(2).max(400).required(),
      image: Joi.string().required().pattern(regExp),
      trailer: Joi.string().required().pattern(regExp),
      thumbnail: Joi.string().required().pattern(regExp),
      movieId: Joi.string().length(24).hex(),
      nameRU: Joi.number().min(2).max(30).required(),
      nameEN: Joi.number().min(2).max(30).required(),
    }),
  }),
  createMovie,
);

router.delete(
  "/movies/:movieId",
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).hex(),
    }),
  }),
  deleteMovieByID,
);

module.exports = router;
