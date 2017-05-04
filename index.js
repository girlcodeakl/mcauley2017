//set up
var database = null;
var express = require('express')
var app = express();
var bodyParser = require('body-parser')


//If a client asks for a file,
//look in the public folder. If it's there, give it to them.
app.use(express.static(__dirname + '/public'));

//this lets us read POST data
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//make an empty list
var posts = [];

//let a client GET the list
var sendPostsList = function (request, response) {
  response.send(posts);
}
app.get('/posts', sendPostsList);

//let a client POST something new
var saveNewPost = function (request, response) {
  console.log(request.body.message); //write it on the command prompt so we can see
  console.log(request.body.author); //write it on the command prompt so we can see

  var post = {};
  post.message = request.body.message;
  post.author = request.body.author;
  if (request.body.URL===""){
    post.image = "https://s-media-cache-ak0.pinimg.com/736x/f3/b8/5b/f3b85bd1a0a6cc2a652db785ca269769.jpg";
  }else {
  post.image = request.body.URL;
  }
  post.time = new Date();
  posts.push(post); //save it in our list
  var dbPosts = database.collection('posts');
dbPosts.insert(post);
  response.send("thanks for your message. Press back to add another");
}
app.post('/posts', saveNewPost);



//listen for connections on port 3000
app.listen(process.env.PORT || 3000);
console.log("Hi! I am listening at http://localhost:3000");

var mongodb = require('mongodb');
var uri = 'mongodb://GirlCode2017:Password1@ds131151.mlab.com:31151/keep';
mongodb.MongoClient.connect(uri, function(err, newdb) {
  if(err) throw err;
  console.log("yay we connected to the database");
  database = newdb;
  var dbPosts = database.collection('posts');
  dbPosts.find(function (err, cursor) {
    cursor.each(function (err, item) {
      if (item != null) {
        posts.push(item);
      }
    });
  });
});
