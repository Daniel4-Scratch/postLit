const checkIfSignedIn = async function () {
  const response = await fetch("https://www.postlit.dev/messages/");
  const data = await response.text();
  return data.includes('class="messages"');
};

const setMessageCount = async function () {
  const isSignedIn = await checkIfSignedIn();
  if (isSignedIn) {
    const response = await fetch("https://www.postlit.dev/messages/count/");
    const data = await response.json();
    chrome.action.setBadgeText({ text: data.count.toString() });
    chrome.action.setBadgeBackgroundColor({ color: "#9688F1" });
  } else {
    chrome.action.setBadgeText({ text: "?" });
    chrome.action.setBadgeBackgroundColor({ color: "#f18888" });
  }
};

chrome.runtime.onInstalled.addListener(async function (object) {
  chrome.alarms.clearAll();
  chrome.alarms.create("displayMessageCount", {
    delayInMinutes: 0.1,
    periodInMinutes: 0.1,
  });
  setMessageCount();
});

chrome.alarms.onAlarm.addListener(async function () {
  chrome.alarms.clearAll();
  chrome.alarms.create("displayMessageCount", {
    delayInMinutes: 0.1,
    periodInMinutes: 0.1,
  });
  setMessageCount();
});
