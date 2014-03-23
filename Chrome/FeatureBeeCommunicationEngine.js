FeatureBeeCommunicationEngine = new function() {

    this.tellChromeToReviseAndCacheToggles = function (toggles, callback) {
        tellChrome({ msg: "chrome-reviseAndCacheToggles", toggles : toggles}, callback);
    };

    this.askChromeIfUrlIsEnabledForFeatureBee = function(url, answerCallback) {
        tellChrome({ msg: "chrome-tellMeIfThisUrlIsEligibleForFeatureBee", url : url}, answerCallback);
    };

    this.tellChromeToGiveMeTheCurrentConfiguration = function(callback) {
        tellChrome({ msg: "chrome-tellMeMyConfiguration" }, callback);
    };

    this.tellChromeToSaveMeTheCurrentConfiguration = function (config, callback) {
        tellChrome({ msg: "chrome-saveMyConfiguration", config : config }, callback);
    };

    this.tellChromeToGiveMeTheCachedToggles = function(callback) {
        tellChrome({ msg: "chrome-giveMeAllCachedToggles" }, callback);
    };

    this.tellChromeToUpdateThisToggle = function (toggle, callback) {
        tellChrome({ msg: "chrome-updateThisToggle", toggle : toggle }, callback);
    };

    this.tellWindowToRefresh = function() {
        tellActiveTab("window-doAFullPageReload");
    };

    this.tellWindowToRefreshToggleBar = function (toggles) {
        tellActiveTab({ msg: "window-refreshToggleBar", toggles: toggles });
    };

    var tellActiveTab = function (message, callback) {
        var request = typeof message === 'string'
            ? { msg: message }
            : message;

        console.log(request);

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, request, function (response) {
                if (callback) {
                    callback(response);
                }
            });
        });
    };

    var tellChrome = function(message, callback) {
        var request = typeof message === 'string'
            ? { msg: message }
            : message;

        console.log(request);

        chrome.runtime.sendMessage(request, function(response) {
            if (callback) {
                callback(response);
            }
        });
    };
};