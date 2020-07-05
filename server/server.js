const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const initiators = {};
const offers = {};
const answers = {};

// allowed for all origins
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/assignInitiator", (req, res) => {
  let { me, them } = req.body;
  // first person to check this endpoint is assigned to be the initiator
  if (them in initiators) {
    res.status(200).json({ isInitiator: false });
  } else {
    initiators[me] = true;
    res.status(200).json({ isInitiator: true });
  }
  console.log(initiators);
});

app.post("/offer", (req, res) => {
  let { me, them, sdp } = req.body;
  console.log(me, them, sdp);
  // store offer
  offers[me] = sdp;
  res.status(200).json("Offer received by server.");
});

app.get("/answer/:them", (req, res) => {
  let { them } = req.params;
  if (answers[them]) {
    console.log("connection successful.");
  }
  res.json(answers[them] || {});
  // answers are deleted as soon as they're read
  delete answers[them];
});

app.get("/offer/:them", (req, res) => {
  let { them } = req.params;
  res.json(offers[them] || {});
  // offers are deleted as soon as they're read
  delete offers[them];
});

app.post("/answer", (req, res) => {
  let { me, them, sdp } = req.body;
  // store answer
  answers[me] = sdp;
  res.status(200).json("Answer received by server.");

  // can reset initiators
  delete initiators[them];
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
