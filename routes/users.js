const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getUserByID,
  updateProfile,
  getMyInfo,
} = require("../controllers/users");

router.get("/users/me", getMyInfo);
router.get(
  "/users/:userId",
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex(),
    }),
  }),
  getUserByID,
);
router.patch(
  "/users/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  updateProfile,
);

module.exports = router;
