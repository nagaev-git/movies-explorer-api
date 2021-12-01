const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { login, createUser } = require("../controllers/users");

router.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8).max(35),
    }),
  }),
  createUser,
);

router.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

module.exports = router;
