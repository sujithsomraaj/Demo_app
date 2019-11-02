const express = require('express');
const morgan = require('morgan')
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const cors=require('cors');  
const hsts = require('hsts')

require('./routes/users');
//const path = require('path');
const helmet=require('helmet');
var sslRedirect = require('heroku-ssl-redirect');
var compression = require('compression');
const nocache = require('nocache');


const PORT = process.env.PORT || 5000;
require('./config/passport');
//var mongodb = require('mongodb');

mongoose.Promise = global.Promise;
 mongoose.connect('mongodb://localhost/nodeberry');
 
const app = express();
app.use(sslRedirect());
app.use(compression());
app.use(morgan('dev'));
app.use(cors());
//app.use(express.csrf())
app.use(helmet());
app.use(helmet.xssFilter());
app.use(helmet.frameguard());
app.use(nocache());
app.use(hsts({
  maxAge: 15552000  // 180 days in seconds
}));

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', expressHandlebars({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars'); 
app.use('./routes/uploads',express.static('uploads'));
app.use(express.static('./public'));
app.use(bodyParser.json());


if(process.env.NODE_ENV=== 'production'){
  app.use(express.static('client/build'));
  app.use('./routes/uploads',express.static('uploads'));
  app.use(express.static('./public'));

  app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'client/build/index.html'));
  })
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  cookie: { maxAge: 60000 },
  secret: 'nodeberryseceret',
  saveUninitialized: false,
  resave: false
}));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', '*');  // enables all the methods to take place
  return next();
});
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());


app.use('/users', require('./routes/users'));


app.listen(PORT, () => console.log(`Server started listening on port ${PORT}`));
