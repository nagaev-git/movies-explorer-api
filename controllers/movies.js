const Movie = require("../models/movie");
const BadRequestError = require("../errors/bad-request-err");
const ForbiddenError = require("../errors/forbidden-err");
const NotFoundError = require("../errors/not-found-err");

module.exports.getMovie = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => {
      res.status(200).send(movie);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            `${Object.values(err.errors)
              .map((error) => error.message)
              .join(" ")}`,
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovieByID = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new Error("IncorrectID"))
    .then((movie) => {
      if (movie.owner.toString() === req.user._id.toString()) {
        movie.remove().then(() => res.status(200).send({
          message: `Фильм c _id: ${req.params.movieId} успешно удален.`,
        }));
      } else {
        next(
          new ForbiddenError(
            `Фильм c _id: ${req.params.movieId} создал другой пользователь. Невозможно удалить.`,
          ),
        );
      }
    })
    .catch((err) => {
      if (err.message === "IncorrectID") {
        next(
          new NotFoundError(
            `Фильм с указанным _id: ${req.params.movieId} не найден.`,
          ),
        );
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Переданы некорректные данные."));
      } else {
        next(err);
      }
    });
};
