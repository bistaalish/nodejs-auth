require('dotenv').config();
require('express-async-errors');
const express = require('express');


// extra security packages
const helmet = require('helmet')
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit')

// ConnectDb
const connectDB = require('./db/connect');
const app = express();

// error handler
const notFoundMiddleware = require('./middlewares/not-found');
const errorHandlerMiddleware = require('./middlewares/error-handler');

app.set('trust proxy', 1);
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100
}))
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())



// routes
app.get('/', (req, res) => {
  res.send('Express boilerplate is successful');
});



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
