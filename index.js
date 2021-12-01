const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const { errors } = require("celebrate");
const helmet = require("helmet");

const app = express();

const NotFoundError = require("./errors/not-found-err");

const limiter = require("./utils/limiter");

const usersRoute = require("./routes/users");
const moviesRoute = require("./routes/movies");
const authRoute = require("./routes/auth");

const { requestLogger, errorLogger } = require("./middlewares/logger");
const corsMiddleware = require("./middlewares/cors-defend");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/error");

const { PORT = 3001, MONGO_URL = "mongodb://localhost:27017/moviesdb" } = process.env;

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});

app.use(limiter);

app.use(express.json());

app.use(corsMiddleware);

app.use(requestLogger);

app.use(helmet());

app.use(authRoute);
app.use(auth);
app.use(usersRoute);
app.use(moviesRoute);

app.use("*", (req, res, next) => next(new NotFoundError("Ресурс не найден.")));

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Ссылка на сервер: http://localhost:${PORT}`);
});
