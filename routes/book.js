const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Book = require("../models/book");
const Genre = require("../models/genre");
const Review = require("../models/review");
const multerConfig = require("./multer");
const cloud = require('./cloudinaryConfig')
const cloudinary = require('cloudinary')
const fs = require("fs");
router.get("/:id", async (req, res) => {
  const book = await Book.findById(req.params.id).populate('user').populate('genre').populate('reviews',).exec();
  const reviews = await Review.find({book:book.id }).populate('user').exec()



  res.send({ book: book, reviews:reviews});
});

router.post("/new", multerConfig.single("coverImage"), async (req, res) => {
  const id = req.session.isAuth || false;
  let user = false;

  const data = {};
  const { title, auther, description, genre, coverImage } = req.body;
  
  if (id) {
    user = await User.findById(id);

    const result = await cloud.uploads(req.file.path)
    console.log(result)
    const book = await new Book({
      title,
      auther,
      description,
      genre,
      coverImage: result.url,
      cloud_id:result.id,
      user: user,
    });
    try {
      const newbook = await book.save();
      user.books.push(newbook._id);
      user.save();
      
      data.alert = `<i class="fa fa-check-circle"></i>The book was successfully published`;
      data.type = "success";
      data.book = newbook;
      // delete image local
      fs.unlinkSync(req.file.path)
    } catch (error) {
      console.log(error)
      data.alert = `<i class="fa fa-exclamation-triangle"></i> somting Wrong plees try again" `;
      data.type = "error";
    }
  } else {
    
  }
  res.json({ responce: data });
  
});
router.put("/edit/:id", multerConfig.single("coverImage"), async (req, res) => {
  const data = {};
  const { title, auther, description, genre, coverImage } = req.body;
  try {
    const book = await Book.findById(req.params.id);
    book.title = title;
    book.auther = auther;
    book.description = description;
    book.genre = genre;

    if (coverImage !== "undefined" && coverImage !== "") {
      await cloudinary.uploader.destroy(book.cloud_id)
      const result = await cloud.uploads(req.file.path)
      book.coverImage= result.url
      book.cloud_id=result.id
     
    }
    await book.save();
    data.alert = `<i class="fa fa-check-circle"></i>The book has been successfully modified`;
    data.type = "success";
    data.book = book;
  } catch (error) {
    console.log(error)
    data.alert = `<i class="fa fa-exclamation-triangle"></i> somting Wrong plees try again" `;
    data.type = "error";
  }
  res.json({ responce: data });
});

router.delete("/:id", async (req, res) => {
  const data = {};
  const id = req.session.isAuth || false;
  try {

    const user = await User.findById(id);
    const book = await Book.findById(req.params.id);
    await cloudinary.uploader.destroy(book.cloud_id)
    await book.remove();
    await user.books.pop(book._id);
    await user.save();
    data.alert = `<i class="fa fa-check-circle"></i>The book has been successfully deleted`;
    data.type = "success";
    data.bookId = req.params.id;
  } catch {
    data.alert = `<i class="fa fa-exclamation-triangle"></i> somting Wrong plees try again`;
    data.type = "error";
    data.bookId = req.params.id;
  }
  res.json({ responce: data });
});

router.post("/add-review/:id", async (req, res) => {
  const id = req.session.isAuth || false;
  let user = false;

  const data = {};
  const { reviewText } = req.body;
  
  
  if (id) {
    user = await User.findById(id);
    const book = await Book.findById(req.params.id);
    const review = await new Review({
      review: reviewText,
      user,
      book,
    });
    try {
      const newreview = await review.save();
      book.reviews.push(newreview._id);
      await book.save();
      data.type = "success";
      data.review = newreview;
    } catch (error) {
      
      data.type = "error";
    }
  } else {
    
  }
  res.json({ responce: data });
  
});
module.exports = router;
