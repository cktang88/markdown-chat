var buffer = require("buffer");
var events = require("events");
import Events from "events";
import Buffer from "buffer";
import Peer from "simple-peer";
// let Peer = (conf) => {
//   on: () => {};
// };

const p = new Peer({
  initiator: location.hash === "#1",
  trickle: false,
});

p.on("error", (err) => console.log("error", err));

p.on("signal", (data) => {
  console.log("SIGNAL", JSON.stringify(data));
  document.querySelector("#outgoing").textContent = JSON.stringify(data);
});

document.querySelector("form").addEventListener("submit", (ev) => {
  ev.preventDefault();
  p.signal(JSON.parse(document.querySelector("#incoming").innerHTML)); // .value
});

p.on("connect", () => {
  console.log("CONNECT");
  p.send("whatever" + Math.random());
});

p.on("data", (data) => {
  console.log("data: " + data);
});
// let a = 1;
