require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

//mongoose
mongoose
  .connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((x) => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch((err) => console.error('Error connecting to mongo', err));

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

app.use(
    cors({
      credentials: true,
      origin:["http://localhost:3001","https://cocorayado.netlify.app"]
    })
  );

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//rutas
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const recipeRouter = require('./routes/recipe');
const indexRouter = require('./routes/index');

app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth',authRouter);
app.use('/api/recipe',recipeRouter);
app.use('*', (req,res)=>{
    res.sendFile(path.join(__dirname,"public","index.html"))
  })

module.exports = app;