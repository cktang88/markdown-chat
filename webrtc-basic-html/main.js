const isInitiator = location.hash === "#1";
var p = new SimplePeer({
  initiator: isInitiator,
  trickle: false,
});

let isConnected = false;

const clearOutput = () => {
  document.getElementById("outgoing").innerHTML = "";
};
const clearInput = () => {
  document.getElementById("incoming").value = "";
};
const addText = (html) => {
  document.getElementById("outgoing").innerHTML += html;
};

let reConnect = (ev) => {
  ev.preventDefault();
  // destroy current connection
  console.log("destroying connection");
  p.destroy();
  console.log("making new connection...", isInitiator);
  p = new SimplePeer({
    initiator: isInitiator,
    trickle: false,
  });

  if (!isInitiator) {
    fetch(
      `https://signalserver.glitch.me/offer/${
        document.getElementById("them").value
      }/${document.getElementById("me").value}`
    )
      .then((res) => res.json())
      .then((offer) => {
        console.log("received offer: ", offer);
        p.signal(JSON.parse(offer));
      })
      .catch((err) => console.log(err));
  }

  p.on("error", (err) => console.log("error", err));

  p.on("signal", (data) => {
    console.log("SIGNAL", JSON.stringify(data));

    if (isInitiator) {
      fetch("https://signalserver.glitch.me/offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          me: document.getElementById("me").value,
          them: document.getElementById("them").value,
          sdp: JSON.stringify(data),
        }),
      })
        .then((res) => res.json())
        .then((answer) => {
          console.log("received answer: ", answer);
          p.signal(JSON.parse(answer));
        });
    } else {
      fetch("https://signalserver.glitch.me/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          me: document.getElementById("me").value,
          them: document.getElementById("them").value,
          sdp: JSON.stringify(data),
        }),
      });
    }
    // document.querySelector("#outgoing").textContent = JSON.stringify(data);
  });

  p.on("connect", () => {
    console.log("CONNECTED");
    isConnected = true;
    clearOutput();
    // clearInput();
  });

  p.on("data", (data) => {
    console.log("data: " + data);
    addText(`<p class="other">${data}</p>`);
  });
};

const sendMessage = (ev) => {
  ev.preventDefault();
  let val = document.getElementById("incoming").value;
  // console.log(val);
  if (!isConnected) {
  } else {
    p.send(val);
    clearInput();
    addText(`<p class="me">${val}</p>`);
  }
};
document.getElementById("connectform").addEventListener("submit", reConnect);

document.getElementById("chatform").addEventListener("submit", sendMessage);
