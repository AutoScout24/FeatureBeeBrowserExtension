chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.executeScript({
        file: 'data/js/Repository.js'
    });

    chrome.tabs.executeScript({
        file: 'data/js/Presenter.js'
    });
});