var express = require('express');
var pgp = require('../js/pgp');
var router = express.Router();

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function randomString(n) {
  var alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  var str = '';
  for (var i = 0; i < n; i++) {
    str += alphabet.charAt(getRandomInt(alphabet.length));
  }

  return str;
}

var sess;
/* GET home page. */
router.get('/', function (req, res, next) {
  sess = req.session;
  if (sess.id)
    res.render('index', {title: 'Keybase PGP-RTC', user: sess.id});
  else {
    res.redirect('/login');
  }
});

router.get('/login', function (req, res, next) {
  res.render('login', {title: 'Login', nonce: randomString(20)});
});

router.post('/login', function (req, res, next) {
  sess = req.session;

  var user = req.body.username;
  var armored = req.body.password;
  pgp.verify(user, armored, function(verified, str) {
    if (verified) {
      sess.id = user;
      res.redirect('/');
    } else {
      //not valid
      res.redirect('/login');
    }
  })

  sess.id = req.body.username;

});

router.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    else {
      res.redirect('/');
    }
  });
});

module.exports = router;
