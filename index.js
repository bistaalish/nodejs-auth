require('dotenv').config();
require('express-async-errors');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
// extra security packages
const helmet = require('helmet')
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit')
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middlewares/authentication');
const protectedRoutes = require('./routes/protectedRoutes');

// ConnectDb
const connectDB = require('./db/connect');
const app = express();

// error handler
const notFoundMiddleware = require('./middlewares/not-found');
const errorHandlerMiddleware = require('./middlewares/error-handler');

app.set('trust proxy', 1);
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many password reset requests from this IP, please try again later.'
}))
app.use(session({ secret: process.env.SECRET_KEY , resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(express.static(__dirname + "/public"));



// routes
app.get('/', (req, res) => {
  res.send('Express boilerplate is successful');
});

app.use("/auth",authRoutes)
app.use('/user',authMiddleware,protectedRoutes)


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
