const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
// const multer = require("multer");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    credentials: true,
  })
);

// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "Cars");
//   },
//   filename: function (req, file, cb) {
//     cb(null, new Date().toISOString() + "-" + file.originalname);
//   },
// });

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/autoDB");
}

app.use(
  session({
    secret: "I hope you have a pretty good time",
    resave: false,
    saveUninitialized: true,
    cookie: {},
  })
);
// app.use(multer({ storage: multerStorage }).single("src"));
app.use(passport.initialize());
app.use(passport.session());

const autoSchema = new mongoose.Schema({
  src: String,
  title: String,
  shortDesc: String,
  priceFrom: String,
  priceTo: String,
  petrol: String,
  diesel: String,
  electric: String,
  sedan: String,
  coupe: String,
  wagon: String,
  hatchback: String,
  suv: String,
  minivan: String,
  pickup: String,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// const specialUserSchema = new mongoose.Schema({
//   username: String,
//   passport: String,
//   workplace: String,
// });

userSchema.plugin(passportLocalMongoose);
// specialUserSchema.plugin(passportLocalMongoose);

const Cars = mongoose.model("Cars", autoSchema);
const User = mongoose.model("User", userSchema);
// const SpecialUser = mongoose.model("SpecialUser", specialUserSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passport.use(SpecialUser.createStrategy());
// passport.serializeUser(SpecialUser.serializeUser());
// passport.deserializeUser(SpecialUser.deserializeUser());

app
  .route("/database")
  .get((req, res) => {
    Cars.find(function (err, car) {
      if (!err) {
        res.send(car);
      } else {
        console.log(err);
      }
    });
  })
  .post((req, res) => {
    const newAuto = new Cars({
      src: req.body.src,
      title: req.body.title,
      shortDesc: req.body.shortDesc,
      priceFrom: req.body.priceFrom,
      priceTo: req.body.priceTo,
      petrol: req.body.petrol,
      diesel: req.body.diesel,
      electric: req.body.electric,
      sedan: req.body.sedan,
      coupe: req.body.coupe,
      wagon: req.body.wagon,
      hatchback: req.body.hatchback,
      suv: req.body.suv,
      minivan: req.body.minivan,
      pickup: req.body.pickup,
    });
    newAuto.save();
  });

app
  .route("/database/:title")
  .get((req, res) => {
    Cars.findOne({ title: req.params.title }, (err, car) => {
      if (!err) {
        res.send(car);
      } else {
        console.log(err);
      }
    });
  })
  .delete((req, res) => {
    Cars.deleteOne({ title: req.params.title }, (err, car) => {
      if (!err) {
        res.send("Deleted" + car);
      } else {
        res.send(err);
      }
    });
  })
  .patch((req, res) => {
    Cars.updateOne(
      { title: req.params.title },
      { $set: req.body },
      (err, car) => {
        if (!err) {
          res.send(car + "Updated");
        } else {
          res.send(err);
        }
      }
    );
  });

app.post("/logout", (req, res) => {
  req.logout();
  console.log("logged out");
});

app.route("/register").post((req, res) => {
  User.register(
    { username: req.body.username },
    req.body.password,
    (err, user) => {
      if (err) {
        throw err;
      }
      if (!user) {
        passport.authenticate("local");
        console.log("Saved");
      }
    }
  );
});

// app.route("/specialRegister").post((req, res) => {
//   SpecialUser.register(
//     { username: req.body.username, workplace: req.body.workplace },
//     req.body.password,
//     (err, user) => {
//       if (err) {
//         throw err;
//       }
//       if (!user) {
//         passport.authenticate("local");
//         console.log("Saved");
//       }
//     }
//   );
// });

app.post("/login", passport.authenticate("local"), function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, function (err) {
    if (err) {
      res.send(err);
    } else {
      res.send(user);
    }
  });
});

// app.post("/specialLogin", passport.authenticate("local"), function (req, res) {
//   const specialUser = new SpecialUser({
//     username: req.body.username,
//     password: req.body.password,
//     worksplace: req.body.workplace,
//   });
//   req.login(specialUser, function (err) {
//     if (err) {
//       res.send(err);
//     } else {
//       res.send(specialUser);
//     }
//   });
// });

const Port = process.env.Port || 8000;

app.listen(Port, () => {
  console.log(`Server is on ${Port}`);
});
