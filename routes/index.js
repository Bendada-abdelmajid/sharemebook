const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Book = require("../models/book");
const Genre = require("../models/genre");

router.get("/", async (req, res) => {
  console.log(req.session)

  const allBooks= await Book.find({}).populate("user").populate("genre").exec();
  let books =[]
  let q= null;
  let genre=null;
  let auther= null;
  const unique = [...new Set(allBooks.map((item) => item.genre))];
  const authers = [...new Set(allBooks.map((item) => item.auther))];
  if(req.query.q) {
    q=req.query.q
  const terms = req.query.q;
  books = await Book.find({ title: { $regex: new RegExp('^'+terms+'-*', "i")}})
  .populate("user")
  .exec();
      
  } else if(req.query.genre) {
    genre= req.query.genre;
    console.log(req.query.genre)
    const g = await Genre.find({title:req.query.genre})
    console.log(g)
    books = await Book.find({genre:g})
    .populate("user")
    .exec();
 
  } else if(req.query.auther) {
    auther= req.query.auther;
    console.log(req.query.auther)
    books = await Book.find({auther:req.query.auther})
    .populate("user")
    .exec();
  } else {
    books=allBooks
    q= null;
 genre=null;
  auther= null;
  }

  res.render("index.ejs", {
    genres: unique,
    books: books,
    authers,
    q,genre, auther
  });
 
});



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
router.get("/my-books", async (req, res) => {
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
  let books=[]
  if (id) {
    user = await User.findById(id);
    for(let b of user.saved){
      const book = await Book.findById(b).populate("user").exec();
      books.push(book)

    }
  }
  
  res.render("saved.ejs", {
    books: books,
   
  });
})
router.get("/users", async (req, res) => {


  let users=[]
  let q=null;
  

    if(req.query.q) {
      const terms = req.query.q.trim();

      q=req.query.q;
      users = await User.find({ username: { $regex: new RegExp(terms, "i") } }).exec()
      
    } else {
      users= await User.find({})
    }
  
  res.render("users.ejs", {
    users: users,
    q:q,
  });
})
module.exports = router;
