require('dotenv').config();
require('express-async-errors');

const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const fs = require('fs');
const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
var bodyParser = require('body-parser');

app.use(bodyParser.json({limit: '50mb'}) );
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit:50000
}));

const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,           
  optionSuccessStatus:200,

}
cloudinary.config({
  secure: true
});
app.use(cors(corsOptions));
//connection to the database 

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
app.use(express.json());
app.use(helmet());
app.use(xss());

// image


// routes
const authRouter = require('./routes/auth');
const candidateRouter = require('./routes/candidate');
const electionRouter = require('./routes/election');
const voteRouter = require('./routes/vote');
const userRouter = require('./routes/User');
const commentsRouter = require('./routes/comments');
const noticationRouter = require('./routes/notification');





app.get('/', (req, res) => {
  res.send('voting api');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/candidate', candidateRouter);
app.use('/api/v1/election', electionRouter);
app.use('/api/v1/vote', voteRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/comments', commentsRouter);
app.use('/api/v1/notification', noticationRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MANGODB_CONNECTION_KEY);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
