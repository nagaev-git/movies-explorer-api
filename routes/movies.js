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
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().pattern(regExp),
      trailer: Joi.string().required().pattern(regExp),
      thumbnail: Joi.string().required().pattern(regExp),
      movieId: Joi.string().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);

router.delete(
  "/movies/:movieId",
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().required().length(24).hex(),
    }),
  }),
  deleteMovieByID,
);

module.exports = router;
