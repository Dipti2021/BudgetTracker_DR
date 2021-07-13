const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");//mongodbatlas- try it  mongoose.connect
const compression = require("compression");

const PORT = process.env.PORT || 3002; //3002;// cannot work with a static port number //when deploying to heroku


const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

//mainly for testing purpose.. need remote db, change to mongo uri


mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/budgetonoffdb",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
);

// routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});