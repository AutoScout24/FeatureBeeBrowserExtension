chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.executeScript({
        file: 'Scripts/Repository.js'
    });

    chrome.tabs.executeScript({
        file: 'Scripts/Presenter.js'
    });
});