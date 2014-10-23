var express = require('express'),
    stylus = require('stylus'),
    nib = require('nib'),
    nunjucks = require('nunjucks');

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
  res.render('index.html');
});
