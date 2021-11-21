const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  updateProfile,
  getMyInfo,
} = require("../controllers/users");

router.get("/users/me", getMyInfo);

router.patch(
  "/users/me",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  updateProfile,
);

module.exports = router;
