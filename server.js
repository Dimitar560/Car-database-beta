const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH, PUT, DELETE, OPTIONS"
//   );
//   next();
// });

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/autoDB");
}

const autoSchema = new mongoose.Schema({
  src: String,
  title: String,
  shortDesc: String,
});

const Cars = mongoose.model("Cars", autoSchema);

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
    Cars.deleteOne({ title: req.params.title }, (err) => {
      if (!err) {
        res.send("Deleted");
      } else {
        res.send(err);
      }
    });
  });

const Port = process.env.Port || 8000;

app.listen(Port, () => {
  console.log(`Server is on ${Port}`);
});
