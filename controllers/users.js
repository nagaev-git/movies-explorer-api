const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const ConflictError = require("../errors/conflict-err");
const UnauthorizedError = require("../errors/unauthorized-err");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getMyInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      next(
        new NotFoundError(
          "Пользователь по заданному ID отсутствует в базе данных",
        ),
      );
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Переданы некорректные данные."));
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  User.findOne({ email })
    .then((usr) => {
      if (usr) {
        throw new ConflictError("Пользователь с таким email уже существует");
      }
      bcrypt
        .hash(password, 10)
        .then((hash) => User.create({
          name,
          email,
          password: hash,
        }))
        .then((user) => {
          const userDoc = user._doc;
          delete userDoc.password;
          res.status(200).send(user);
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
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(new Error("IncorrectID"))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === "IncorrectID") {
        next(new NotFoundError("Пользователь с указанным _id не найден."));
      } else if (err.name === "ValidationError") {
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

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select("+password")
    .orFail(new Error("IncorrectEmail"))
    .then((user) => {
      bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          next(new UnauthorizedError("Указан некорректный Email или пароль."));
        } else {
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === "production" ? JWT_SECRET : "strongest-key-ever",
            { expiresIn: "7d" },
          );
          res.status(201).send({ token });
        }
      });
    })
    .catch((err) => {
      if (err.message === "IncorrectEmail") {
        next(new UnauthorizedError("Указан некорректный Email или пароль."));
      } else {
        next(err);
      }
    });
};
