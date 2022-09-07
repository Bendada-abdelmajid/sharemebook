const { response } = require("express");
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Book = require("../models/book");
const bcrypt = require("bcrypt");
const multerConfig = require("./multer");
const cloud = require('./cloudinaryConfig')
const cloudinary = require('cloudinary')
router.get("/:id", async (req, res) => {
  const id = req.session.isAuth || false;
  let user = [];
  let userbooks = [];
  let userImage = "";
  let isautincat = false;
  if (id == req.params.id) {
    isautincat = true;
  } else {
    user = await User.findById(req.params.id).populate('books');
    userImage = await user.userImage ? `<img src="${await user.userImage}"/>` : '<i class="fa fa-user"></i>';

    userbooks = await user.books;
  }
  res.send({
    username: user.username,
    userImage: userImage,
    userbooks: userbooks,
    isautincat: isautincat,
  });
});
// Create Author Route
router.post("/sing-up", async (req, res) => {
  const data = {};
  const { username, email, password } = req.body;

  const checkUser = await User.findOne({ email });
  if (checkUser) {
   
    data.alert = "this email is already have";
    data.type = "error";
  } else {
    const salt = await bcrypt.genSalt();
    const hashePassword = await bcrypt.hash(password, salt);
    const user = await new User({
      username,
      email,
      password: hashePassword,
    });
    try {
      const newuser = await user.save();
     
      data.alert = "user create sucsfuly";
      data.type = "sucsses";
      req.session.isAuth = newuser.id;
    } catch {
      data.alert = "somting rong plees try again";
      data.type = "error";
    }
  }

  res.send({ responce: data });
  
});
router.post("/login", async (req, res) => {
  const data = {};
  const user = await User.findOne({ email: req.body.email });

  
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      
      data.alert = "welcome " + user.username;
      data.type = "success";
      req.session.isAuth = user.id;
    } else {
      
      data.alert = "password rong";
      data.type = "error";
    }
  } else {
    
    data.alert = "email rong";
    data.type = "error";
  }
  
  res.send({ responce: data });
});
router.post("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
  
});

router.put("/edit/:id", multerConfig.single("userImage"), async (req, res) => {
  const data = {};

  const { username, email, userImage } = req.body;
  const checkUser = await User.findOne({ email });

  if (checkUser && checkUser.email != email) {
    data.alert = "this email is already exist";
    data.type = "error";
  } else {
    try {
      
      const user = await User.findById(req.params.id);

      user.username = username;
      user.email = email;

      if (userImage !== "undefined" && userImage !== "") {
        if(user.userImage) {
          await cloudinary.uploader.destroy(user.cloud_id)
        }
          const result = await cloud.uploads(req.file.path)
          console.log(result)
          user.userImage= result.url
        user.cloud_id=result.id
      }
      await user.save();
      data.alert = `<i class="fa fa-check-circle"></i> Your profile has been successfully modified`;
      data.type = "success";
      data.user = user;
    } catch (error) {
      console.log(error)
      data.alert = `<i class="fa fa-exclamation-triangle"></i> somting Wrong plees try again`;
      data.type = "error";
    }
  }
  res.json({ responce: data });
});
router.put("/change-password/:id", async (req, res) => {
  const data = {};

  const { oldPassword, newPassword, confirmPassword } = req.body;
  try {
    const user = await User.findById(req.params.id);
    
    
    
    if (await bcrypt.compare(oldPassword, user.password)) {
      if (newPassword === confirmPassword) {
        const salt = await bcrypt.genSalt();
        const hashePassword = await bcrypt.hash(newPassword, salt);
        user.password = hashePassword;
        await user.save();
        data.alert = `<i class="fa fa-check-circle"></i>Your password has been successfully changed`;
        data.type = "success";
      } else {
        data.alert = "confirm password Wrong";
        data.type = "error";
      }
    } else {
      data.alert = "Your password Wrong";
      data.type = "error";
    }
  } catch (error) {
    
    data.alert = `<i class="fa fa-exclamation-triangle"></i> somting Wrong plees try again" `;
    data.type = "error";
  }

  res.json({ responce: data });
});

router.post("/save/:id", async (req, res) => {
  const id = req.session.isAuth || false;
  let user = false;
  const data = {};
  
  if (id) {
    user = await User.findById(id);
    const book = await Book.findById(req.params.id);
    try {
      if (user.saved.includes(book._id)) {
        user.saved.pop(book._id);
        await user.save();
        data.save = "far";
      } else {
        user.saved.push(book._id);
        await user.save();
        data.save = "fa";
      }
      data.type = "success";
    } catch (error) {
      
      data.type = "error";
    }
  } else {
    
  }
  res.json({ responce: data });
});
router.post("/search", async (req, res) => {
  const terms = req.body.q.trim();
  let search = await User.find({ username: { $regex: new RegExp(terms, "i") } })
  res.send({ search: search });
});
module.exports = router;
