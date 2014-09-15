chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.executeScript({
        file: 'data/js/chrome/FeatureBeeClientInterface.js'
    });

    chrome.tabs.executeScript({
        file: 'data/js/Repository.js'
    });

    chrome.tabs.executeScript({
        file: 'data/js/Presenter.js'
    });
});

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
      switch (request.action) {
          case 'copy':
                  var copyinput = document.createElement('input');
                  document.body.appendChild(copyinput);

                  copyinput.value = request.value;
                  copyinput.focus();
                  copyinput.select();

                  document.execCommand("copy");
              break;
          default:
              break;
      }
  });