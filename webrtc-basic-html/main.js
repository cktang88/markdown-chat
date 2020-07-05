let p;

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
  if (p) p.destroy();
  const isInitiator = document.getElementById("isInitiator").checked;

  console.log("making new connection...", isInitiator);
  p = new SimplePeer({
    initiator: isInitiator,
    trickle: false,
  });

  if (!isInitiator) {
    fetch(
      `https://signalserver.glitch.me/offer/${
        document.getElementById("them").value
      }`
      //${ document.getElementById("me").value }
    )
      .then((res) => res.json())
      .then((offer) => {
        console.log("received offer: ", offer);
        p.signal(JSON.parse(offer));
      })
      .catch((err) => {
        alert("Please initiate a connection by checking the checkbox.");
        console.log(err);
      });
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
        .then(() => {
          var interval = setInterval(function () {
            console.log("waiting...");
            fetch(
              `https://signalserver.glitch.me/answer/${
                document.getElementById("them").value
              }`
              //${ document.getElementById("me").value }
            )
              .then((res) => res.json())
              .then((answer) => {
                if (!answer || Object.keys(answer).length == 0) return;
                console.log("received answer: ", answer);
                clearInterval(interval);
                p.signal(JSON.parse(answer));
              });
          }, 1000);
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
    addText(`<p class="me">Connected!</p>`);
    // clearInput();
  });

  p.on("data", (data) => {
    console.log("data: " + data);
    addText(`<p class="other">${data}</p>`);
  });
  //   p.on("close", () => {
  //     console.log("connection closed...");
  //   });
};

const sendMessage = (ev) => {
  ev.preventDefault();
  let val = document.getElementById("incoming").value;
  // console.log(val);
  if (!isConnected || !p) return;
  p.send(val);
  clearInput();
  addText(`<p class="me">${val}</p>`);
};
document.getElementById("connectform").addEventListener("submit", reConnect);

document.getElementById("chatform").addEventListener("submit", sendMessage);
