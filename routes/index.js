const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Book = require("../models/book");
const Genre = require("../models/genre");

router.get("/", async (req, res) => {
  const users = await User.find({});
  let Topusers=[]
  for(let us of users){
  Topusers.push({id:us._id,username:us.username, usimage: us.userImage, userBooks:us.books.length})
  }
  Topusers=  Topusers.sort((a,b)=>parseFloat(b.userBooks) - parseFloat(a.userBooks)).slice(0,7)
  const newBooks = await Book.find()
    .sort({ createdAt: "desc" })
    .limit(12)
    .populate("user")
    .exec();
  res.render("index.ejs", {
    newBooks,
    Topusers,
  });
});

router.get("/explore", async (req, res) => {
  const allBooks= await Book.find({}).populate("user").populate("genre").exec();
  let books =[]

  const unique = [...new Set(allBooks.map((item) => item.genre))];
  if(req.query.q) {
    
    const terms = req.query.q;
    
     books = await Book.find({ title: { $regex: new RegExp('^'+terms+'-*', "i")}})
      .populate("user")
      .exec();
      
  } else if(req.query.g && req.query.g !== "all") {
    
    const genre = await Genre.find({title:req.query.g})
  
    books = await Book.find({genre:genre})
    .populate("user")
    .exec();
 
  } else {
    books=allBooks
  }
   
  
  res.render("explore.ejs", {
    genres: unique,
    books: books,
  });
})

router.get("/settings", async (req, res) => {
  const id = req.session.isAuth || false;
  let user = false;
  if (id) {
    user = await User.findById(id);
  }
  res.render("settings.ejs", {
    user: user,
  });
})
router.get("/myBooks", async (req, res) => {
  const id = req.session.isAuth || false;

  let books=[]
  
  if (id) {
    if(req.query.q) {
    
      const terms = req.query.q;
       books = await Book.find({user:id}).find({title: { $regex: new RegExp('^'+terms+'-*', "i")}}).exec();
    } else {
      books= await Book.find({user:id})
    }
  }
  res.render("mybooks.ejs", {
    books: books,
  });
})
router.get("/saved", async (req, res) => {
  const id = req.session.isAuth || false;
  let user = false;
  if (id) {
    user = await User.findById(id).populate("saved").exec();
  }
  
  res.render("saved.ejs", {
    books: user.saved,
   
  });
})

module.exports = router;
