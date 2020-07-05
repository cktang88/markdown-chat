const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const offers = {};
const answers = {};

// allowed for all origins
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/offer", (req, res) => {
  let { me, them, sdp } = req.body;
  console.log(me, them, sdp);
  // store offer
  if (!offers[me]) offers[me] = sdp;

  // poll until an answer arrives
  let hasAnswer = false;
  var interval = setInterval(function () {
    if (answers[them]) {
      clearInterval(interval);
      res.status(200).json(answers[them]);
      hasAnswer = true;
    }
    console.log("waiting...");
  }, 1000);

  // if(hasAnswer) return
  // else {
  //   res.status(400).json("No answer found")
  // }
});

app.get("/offer/:them", (req, res) => {
  let { them } = req.params;
  res.json(offers[them]);
});

app.post("/answer", (req, res) => {
  let { me, them, sdp } = req.body;

  // store answer
  answers[me] = sdp;
  // return offer
  res.json(offers[them]);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
