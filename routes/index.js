var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET all posts */

router.get('/posts', function(req, res, next){
	Post.find(function(err, posts){
		if(err) { return next(err); }

    res.json(posts);
	});
});

/* POST create posts */

router.post('/posts', function(req, res, next) {
  var post = new Post(req.body);

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});

router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error('can\'t find post')); }

    req.post = post;
    return next();
  });
});

router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});

router.put('/posts/:post/upvote', function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});

router.put('/posts/:post/downvote', function(req, res, next) {
  req.post.downvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});



router.post('/posts/:post/comments', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});

router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error('can\'t find comment')); }

    req.comment = comment;
    return next();
  });
});

router.put('/posts/:post/comments/:comment/upvote', function(req, res, next) {
  req.post.comment.upvote(function(err, comment){
    if (err) { return next(err); }

    res.json(comment);
  });
});


router.get('/login/:usr/:pass', function(req, res){
  console.log("okok");
   User.findOne({
        name: req.params.usr
    }, function(err, result) {
        if (err !== null) {
            console.log(err);
            res.send(err);
        } else {
            if (result == null) {
                console.log("201");
                res.sendStatus(201);
            } else {
                if(result.password === req.params.pass){
                    res.sendStatus(200);
                }
                else{
                    res.sendStatus(201);
                }
            }
        }
    });
});


router.get('/signup/:usr/:pass', function(req, res){
  console.log("in signup");
var newUser = new User({
        "name": req.params.usr,
        "password": req.params.pass
    });

    User.find({
        name: req.params.user
    }, function(err, result) {
        if (err !== null) {
            console.log(err);
            res.send(err);
        } else {
            if (result.length) {
                console.log("201");
                res.sendStatus(201);
            } else {
                newUser.save(function(err) {
                    if (err !== null) {
                        console.log(err);
                        res.send(err);
                    } else {
                        console.log("User added to db")
                        res.sendStatus(200);
                    }
                })
            }
        }
    })
});



module.exports = router;
