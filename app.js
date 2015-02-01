const KEY = 'ntalk.sid'
      , SECRET = 'ntalk';

var express        = require('express')
  , load           = require('express-load')
  , bodyParser     = require('body-parser')
  , cookieParser   = require('cookie-parser')
  , expressSession = require('express-session')
  , methodOverride = require('method-override')
  , error          = require('./middlewares/error')
  , app            = express()
  , server         = require('http').Server(app)
  , io             = require('socket.io')(server)
  , cookie         = cookieParser(SECRET)
  , store          = new expressSession.MemoryStore()
  , mongoose       = require('mongoose');

global.db = mongoose.connect('mongodb://localhost/ntalk');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(cookie);
app.use(expressSession({
  secret: SECRET,
  name: KEY,
  resave: true,
  saveUninitialized: true,
  store: store
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));

io.use(function(socket, next) {
  var data = socket.request;
  cookie(data, {}, function(err) {
    var sessionID = data.signedCookies[KEY];
    store.get(sessionID, function(err, session) {
      if (err || !session) {
        return next(new Error('acesso negado'));
      } else {
        socket.handshake.session = session;
        return next();
      } 
    });
  }); 
});

load('models')
  .then('controllers')
  .then('routes')
  .into(app);

load('sockets')
  .into(io);

app.use(error.notFound);
app.use(error.serverError);

server.listen(3001, function() {
  console.log('NTalk no ar.');
});

