const checkIfSignedIn = async function () {
  const response = await fetch("https://www.postlit.dev/me/");
  const data = await response.json();
  return !data.error;
};

const setMessageCount = async function () {
  const isSignedIn = await checkIfSignedIn();
  if (isSignedIn) {
    const response = await fetch("https://www.postlit.dev/messages/count/");
    const data = await response.json();
    chrome.action.setBadgeText({ text: data.count.toString() });
    chrome.action.setBadgeBackgroundColor({ color: "#9688F1" });
    const lastMessageCount = (await chrome.storage.sync.get("message-count"))[
      "message-count"
    ];
    await chrome.storage.sync.set({ "message-count": data.count });
    if (lastMessageCount < data.count) {
      const messages = await fetch("https://www.postlit.dev/my/messages/");
      const messageData = await messages.json();
      messageData.forEach(function (message, i) {
        const messageTypes = {
            "repost": `@${message.creator} just reposted your post!`,
            "mention": `@${message.creator} just mentioned you in their post!`,
            "comment-mention": `@${message.creator} just mentioned you in their comment!`,
            "comment-reply": `@${message.creator} just replied to your comment!`,
            "comment": `@${message.creator} just commented on your post!`,
            "follow": `@${message.creator} just followed you!`,
          }
        if (i + 1 > lastMessageCount) {
          chrome.notifications.create(message._id, {
            title: "@" + message.creator + " on postLit",
            message: messageTypes[message.type],
            iconUrl: "/icons/icon128.png",
            type: "basic",
          });
        }
      });
    }
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
