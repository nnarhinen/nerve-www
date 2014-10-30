var express = require('express'),
    stylus = require('stylus'),
    nib = require('nib'),
    nunjucks = require('nunjucks'),
    bodyParser = require('body-parser'),
    mailgun = require('./mailgun');

var app = module.exports = express();

var compileStylus = function(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
    .import('nib');
};

nunjucks.configure(__dirname + '/views', {
    autoescape: true,
    express: app
});

app.use('/site/static', stylus.middleware({src: __dirname + '/public', compile: compileStylus}));
app.use('/site/static', express.static(__dirname + '/public'));

app.get('/', function(req, res, next) {
  res.render('index.html', {
    thankyou: typeof req.query.thankyou !== 'undefined'
  });
});

app.post('/subscribe', bodyParser.urlencoded({extended: true}), function(req, res, next) {
  if (!req.body.email) return res.redirect('/');
  mailgun(process.env.MAILGUN_API_KEY).mailingList('beta@melli.fi').addMember({
    address: req.body.email,
    upsert: 'yes'
  }).then(function() {
    res.redirect('/?thankyou');
  }).catch(next);
});
