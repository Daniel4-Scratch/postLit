/* Dynamic Styling */

const dynamicTheme = async function () {
  const response = await fetch("https://www.postlit.dev/me/");
  const data = await response.json();
  const theme = data.theme;
  if (theme == "green"){
    document.body.classList.add("")
  }else if(theme == "blue"){
    document.body.classList.add("blue")
  }else if(theme == "red"){
    document.body.classList.add("red")
  }else if(theme == "pink"){
    document.body.classList.add("pink")
  }else if(theme == "cyan"){
    document.body.classList.add("cyan")
  }else if(theme == "yellow"){
    document.body.classList.add("yellow")
  }else if(theme == "orange"){
    document.body.classList.add("orange")
  }
};

dynamicTheme();

/* Check if signed in */
const checkIfSignedIn = async function () {
  const response = await fetch("https://www.postlit.dev/me/");
  const data = await response.json();
  return !data.error;
};

/* Create popup buttons */
const createPopupButtons = async function () {
  const extensionURL = chrome.runtime.getURL("")
  const isSignedIn = await checkIfSignedIn();
  if (isSignedIn) {
    const button = document.createElement("button");
    button.textContent = "open messages page";
    button.addEventListener("click", function () {
      chrome.tabs.create({
        url: "https://www.postlit.dev/messages/",
      });
    });
    document.querySelector(".navbar").after(button);
    const response = await fetch("https://www.postlit.dev/my/messages/");
    const data = await response.json();
    data.forEach(function (messageData) {
      const div = document.createElement("div");
      div.classList.add("message");
      div.classList.add("post");
      div.innerHTML = messageData.text;
      div.querySelectorAll("a").forEach(function (link) {
        const href = "https://www.postlit.dev/" + link.href.replace(extensionURL, "");
        link.addEventListener("click", function () {
          chrome.tabs.create({
            url: href,
          });
        });
        link.href = null;
      });
      document.querySelector(".messages").prepend(div);
    });
    if (data.length === 0) {
      document.querySelector(".messages").innerHTML = "no unread messages"
    }
    document.querySelector(".messages-box").style.display = null
  } else {
    const button = document.createElement("button");
    button.textContent = "log in";
    button.addEventListener("click", function () {
      chrome.tabs.create({
        url: "https://www.postlit.dev/signin/",
      });
    });
    document.querySelector(".navbar").after(button);
  }
  document.getElementById('loader-wrapper').style = "transition: opacity 0.3s ease-in-out; opacity: 0;";
  setTimeout(function(){document.getElementById('loader-wrapper').style = "display:none;";}, 300)
};
createPopupButtons();

/* Mark as read */
const markAsRead = async function() {
  var response = await fetch("https://www.postlit.dev/markasread/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ all: true }),
  });
  var data = await response.json();
  document.querySelector(".messages").innerHTML = "marked as read"
}

document.querySelector(".mark-as-read").addEventListener("click", markAsRead)
