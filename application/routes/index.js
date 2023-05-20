var express = require('express');
const { isLoggedIn } = require('../middleware/auth');
const { getRecentPosts } = require('../middleware/postsBE');
var router = express.Router();

/* GET home page. */
router.get('/', getRecentPosts, function(req, res, next) {
  res.render('index', { title: 'CSC 317 Home', css:["style.css"]});
});

router.get('/login', function(req,res){
  res.render('login', { title: 'Login', css:["style.css"]});
});

router.get('/postvideo', isLoggedIn, function(req,res){
  res.render('postvideo', { title: 'Post Video', css:["style.css"]});
});

router.get('/register', function(req,res){
  res.render('register', { title: 'Register', css:["style.css"], js:["validation.js"]});
});

module.exports = router;
