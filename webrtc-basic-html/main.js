let p;

let answerPoller;
let me, them;
let isConnected = false;

const clearOutput = (val = "") => {
  document.getElementById("outgoing").innerHTML = val;
};
const clearInput = () => {
  document.getElementById("incoming").value = "";
};
const addText = (html) => {
  document.getElementById("outgoing").innerHTML += html;
};

const post = (url, data) =>
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

let reConnect = async (ev) => {
  ev.preventDefault();
  new_me = document.getElementById("me").value;
  new_them = document.getElementById("them").value;
  if (new_me == me && new_them == them) {
    alert("Currently already connected.");
    return;
  }
  me = new_me;
  them = new_them;

  // destroy current connection
  console.log("destroying connection");
  if (p) p.destroy();
  const isInitiator = await post(
    "https://signalserver.glitch.me/assignInitiator",
    {
      me,
      them,
    }
  )
    .then((res) => res.json())
    .then((res) => res.isInitiator)
    .catch((err) => console.log(err));

  console.log("making new connection...", isInitiator);
  p = new SimplePeer({
    initiator: isInitiator,
    trickle: false,
  });

  if (!isInitiator) {
    fetch(
      `https://signalserver.glitch.me/offer/${them}`
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

  let pollForAnswer = () => {
    let iters = 0;
    // clear previous polls
    if (answerPoller) {
      console.log("cancelled answer polling for previous connection.");
      clearInterval(answerPoller);
    }
    answerPoller = setInterval(function () {
      clearOutput("waiting..." + iters);
      fetch(
        `https://signalserver.glitch.me/answer/${them}`
        //${ document.getElementById("me").value }
      )
        .then((res) => res.json())
        .then((answer) => {
          if (!answer || Object.keys(answer).length == 0) return;
          console.log("received answer: ", answer);
          clearInterval(answerPoller);
          p.signal(JSON.parse(answer));
        });
      iters += 1;
    }, 1000);
  };

  p.on("error", (err) => console.log("error", err));

  p.on("signal", (data) => {
    console.log("SIGNAL", JSON.stringify(data));

    if (isInitiator) {
      post("https://signalserver.glitch.me/offer", {
        me,
        them,
        sdp: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then(pollForAnswer);
    } else {
      post("https://signalserver.glitch.me/answer", {
        me,
        them,
        sdp: JSON.stringify(data),
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
