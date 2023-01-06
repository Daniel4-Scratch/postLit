chrome.storage.onChanged.addListener(function (changes, namespace) {// set a badge
    chrome.action.setBadgeText({text: '1'}); // set a badge text
    chrome.action.setBadgeBackgroundColor({color: '#9688F1'});
});