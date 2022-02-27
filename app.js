//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const req = require('express/lib/request');


const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/public'));

app.use(session({
    secret: 'Our little secret.',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//setting mongoDB
const url = "mongodb+srv://candy:" + process.env.MONGO_PASSWORD + "@cluster0.khvg8.mongodb.net/notesDB";
mongoose.connect(url, {useNewUrlParser: true});

const noteSchema = new mongoose.Schema({
    title: String,
    content: String,
    color: String,
    public: Boolean,
    edit: Boolean
});

const Note = new mongoose.model("Note", noteSchema);


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    googleId: String,
    notes: [noteSchema]
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user.id); 
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


//google strategy
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/dashboard"
  },
  function(accessToken, refreshToken, profile, cb) {

    User.findOrCreate({ googleId: profile.id, name: profile.displayName}, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/dashboard', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect secrets page.
    res.redirect('/dashboard');
});

app.get("/",function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect('/');
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.get("/dashboard", function(req, res) {
  if(req.isAuthenticated()) {
    let currentUserId = req.user._id;
    User.findOne({_id: currentUserId}, function(err, foundUser){
      if(!err) {
          res.render("dashboard", {allNotes: foundUser.notes, currentuser: foundUser});
      }else {
          console.log(err);
      }
    });
  }else{
    res.redirect("/login");
  }   
});

app.get("/shared/:userId/:noteId", function(req, res) {
    let userId = req.params.userId;
    let noteId = req.params.noteId;


    User.findOne({"_id": userId},{notes: {$elemMatch: {_id: noteId}}}, function(err, foundNote){
        if (!err){
            let currentuser;
            User.findOne({_id: userId}, function(err, foundUser){
                if(!err) {
                    if(foundUser) {
                        currentuser = foundUser;
                        res.render("shared", {note: foundNote.notes[0], user: currentuser});
                    }else {
                        res.redirect("/dashboard");
                    }
                    
                }else {
                    console.log(err);
                }
            });
        }else {
            res.render("shared", {note: {}});
        }
    });
});




app.post("/dashboard/changeColor", function(req, res) {
    let userId;
    if(req.body.userId) {
        userId = req.body.userId;
    }else {
        userId = req.user._id;
    }

    let noteId = req.body.formId;
    let newColor = req.body.color;


    if(req.body.userId) {
        User.findOne({"_id": userId},{notes: {$elemMatch: {_id: noteId}}}, function(err, foundNote){
            if (!err){
                if(foundNote.notes[0].edit) {
                    User.updateOne(
                        { _id: userId , "notes._id": noteId},
                        { $set:{ "notes.$.color": newColor} },
                        { upsert: true }, 
                        function(err, foundNote){
                            if(!err) {
                                res.redirect("/shared/" + userId + "/" + noteId);
                            }else {
                                console.log(err);
                            }
                        }
                    );
                }else{
                    res.redirect("/shared/" + userId + "/" + noteId);
                }
            }else {
                console.log(err);
            }
        });
    }else {
        User.updateOne(
            { _id: userId , "notes._id": noteId},
            { $set:{ "notes.$.color": newColor} },
            { upsert: true }, 
            function(err, foundNote){
                if(!err) {
                    res.redirect("/dashboard");
                }else {
                    console.log(err);
                }
            }
        );
    }
    
});

app.post("/dashboard/deleteNote", function(req, res) {
    let nodeId = req.body.deletenoteid;
    let userId = req.user._id;
    User.findOneAndUpdate({_id: userId}, {$pull: {notes: {_id: nodeId}}}, function(err, foundUser){
        if (!err){
            res.redirect("/dashboard");
        }else {
            console.log(err);
        }
    });
});

app.post("/dashboard/editnote", function(req, res) {
    let userId;
    if(req.body.userId) {
        userId = req.body.userId;
    }else {
        userId = req.user._id;
    }
    let noteId = req.body.editnoteid;
    let newTitle = req.body.title;
    let newContent = req.body.content;

    if(req.body.userId) {
        User.findOne({"_id": userId},{notes: {$elemMatch: {_id: noteId}}}, function(err, foundNote){
            if (!err){
                if(foundNote.notes[0].edit) {
                    User.updateOne(
                        { _id: userId , "notes._id": noteId},
                        { $set:{ "notes.$.title": newTitle, "notes.$.content": newContent} },
                        { upsert: true }, 
                        function(err){
                            if(!err) {
                                res.redirect("/shared/" + userId + "/" + noteId);
                            }else {
                                console.log(err);
                            }
                        }
                    );
                }else{
                    res.redirect("/shared/" + userId + "/" + noteId);
                }
            }else {
                console.log(err);
            }
        });
    }else {
        User.updateOne(
            { _id: userId , "notes._id": noteId},
            { $set:{ "notes.$.title": newTitle, "notes.$.content": newContent} },
            { upsert: true }, 
            function(err){
                if(!err) {
                    res.redirect("/dashboard"); 
                }else {
                    console.log(err);
                }
            }
        );
    }
    
});

app.post("/dashboard", function(req, res) {
    let noteTitle = req.body.title;
    let noteContent = req.body.content;
    let userNote = new Note({
        title: noteTitle,
        content: noteContent,
        public: false,
        edit: false,
        color: "white"
    });

    let userId = req.user._id;

    User.findOneAndUpdate({_id: userId}, {$push: {notes: userNote}}, function(err, foundUser){
        if (!err){
            res.redirect("/dashboard");
        }
    });
});


app.post("/dashboard/sharenote", function(req, res) {
    let userId = req.user._id;
    let noteId = req.body.sharenoteid;
    let notePublic = req.body.public;
    let noteEditAccess = req.body.editAccess;
    if(!notePublic) {
        notePublic = false; 
        noteEditAccess = false;
    }else {
        notePublic = true;
        if(!noteEditAccess) {
            noteEditAccess = false;
        }else {
            noteEditAccess = true; 
        }
    }

    User.updateOne(
        { _id: userId , "notes._id": noteId},
        { $set:{ "notes.$.public": notePublic, "notes.$.edit": noteEditAccess} },
        { upsert: true }, 
        function(err){
            if(!err) {
                res.redirect("/dashboard");
            }else {
                console.log(err);
            }
        }
    );
    
});



// app.post("/dashboard/:noteId",function(e) {
//     console.log(req.body);
// });


app.post("/register", function(req, res) {
  User.register({username: req.body.username, name: req.body.Name}, req.body.password, function(err, user) {
      if (err) { 
          console.log(err);
          res.redirect("/register");
      }else {
          passport.authenticate("local")(req, res, function() {
              res.redirect("/dashboard");
          });
      }
    });
});

app.post("/login", function(req, res) {
  const user = new User({
      username: req.body.username,
      password: req.body.password
  });

  req.login(user, function(err) {
      if(err) {
          console.log(err);
      }else {
          passport.authenticate("local")(req, res, function() {
              res.redirect("/dashboard");
          });
      }
  });

});





app.listen(3000, function() {
    console.log("Server started on port 3000");
});
