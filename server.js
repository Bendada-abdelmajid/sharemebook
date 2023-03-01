if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const session = require("express-session");
const  mongoDBSission = require("connect-mongodb-session")(session);
const app = express();

const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
const Genre = require("./models/genre");
const User = require("./models/user");

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const bookRouter = require("./routes/book");


app.use(methodOverride("_method"));
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/// database
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
 
})
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => 


const store= new mongoDBSission ({
    uri:process.env.DATABASE_URL ,
    collection:"mySessions",
})
app.use(
    session({
        secret: 'key that will sign cookie',
        resave: false,
        saveUninitialized: false, 
        store: store,
    })
)
app.use( async function(req,res,next){
  
    const id = await req.session.isAuth || false;
    res.locals.user = false;
  
    if (id) {
        res.locals.user = await User.findById(id);
    
    }
    res.locals.users=await User.find({});
    res.locals.allgenres=await Genre.find({});
    next();
})
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/book", bookRouter);


app.listen(process.env.PORT || 3000);
