var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var helmet = require('helmet');

var router = express.Router();

var registrationController = require('./routes/registration');

OAuthServer = require('oauth2-server');

var app = express();

const url = 'mongodb://localhost:27017/cryptoCurrency';
mongoose.connect(url, function (err, conn) {
    if (err) {
        console.log('DB Not Connected ' + err);
    } else {
        console.log('DB Connected at 27017');
    }
});

app.use(helmet());
app.disable('x-powered-by');

// Set Headers (It should be above the API Routes call)
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.oauth = new OAuthServer({
    model: require('./auth/oauth'),
    grants: ['password'],
    accessTokenLifetime: 60 * 90,
    debug: true
});

app.all('/api/oauth/token', app.oauth.grant());

// Routes
// Create endpoint handlers for /register
router.route('/user/registration').post(registrationController.register);
router.route('/user').get(app.oauth.authorise(), registrationController.getUserData);

// Register all our routes with /api
app.use('/api', router);

app.use(app.oauth.errorHandler());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
