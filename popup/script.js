const checkIfSignedIn = async function () {
  const response = await fetch("https://www.postlit.dev/messages/");
  const data = await response.text();
  const element = document.createElement("html");
  element.innerHTML = data.replace("<!DOCTYPE html>", "");
  if (element.querySelector(".messages")) {
    return true;
  } else {
    return false;
  }
};

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
};
createPopupButtons();

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