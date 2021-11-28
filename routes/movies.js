const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getMovies,
  createMovie,
  deleteMovieByID,
} = require("../controllers/movies");
const urlValidator = require("../utils/urlValidator");

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
      image: Joi.string().required().custom(urlValidator),
      trailer: Joi.string().required().custom(urlValidator),
      thumbnail: Joi.string().required().custom(urlValidator),
      movieId: Joi.number().required(),
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
