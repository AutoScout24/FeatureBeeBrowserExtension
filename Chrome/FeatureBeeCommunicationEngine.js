FeatureBeeCommunicationEngine = new function() {

    this.tellChromeToReviseAndCacheToggles = function (toggles, callback) {
        tellChromeTo({ msg: "reviseAndCacheToggles", toggles : toggles}, callback);
    };

    this.askChromeIfUrlIsEnabledForFeatureBee = function(url, answerCallback) {
        tellChromeTo({ msg: "tellMeIfThisUrlIsEligibleForFeatureBee", url: url }, answerCallback);
    };

    this.tellChromeToGiveMeTheCurrentConfiguration = function(callback) {
        tellChromeTo({ msg: "tellMeMyConfiguration" }, callback);
    };

    this.tellChromeToSaveMeTheCurrentConfiguration = function (config, callback) {
        tellChromeTo({ msg: "saveMyConfiguration", config: config }, callback);
    };

    this.tellChromeToClearMeTheCurrentConfiguration = function (callback) {
        tellChromeTo({ msg: "clearConfiguration"}, callback);
    };

    this.tellChromeToGiveMeTheCachedToggles = function(callback) {
        tellChromeTo({ msg: "giveMeAllCachedToggles" }, callback);
    };

    this.tellChromeToUpdateThisToggle = function (toggle, callback) {
        tellChromeTo({ msg: "updateThisToggle", toggle: toggle }, callback);
    };

    this.tellChromeToUpdateEnvironments = function (environments, callback) {
        tellChromeTo({ msg: "updateCurrentEnvironments", updatedEnvironments: environments }, callback);
    };

    this.tellWindowToRefresh = function(toggles) {
        tellActiveTabTo({ msg: "doAFullPageReload", toggles: toggles });
    };

    this.tellWindowToShowToolbar = function(toggles) {
        tellActiveTabTo({ msg: "showToggleBar", toggles: toggles });
    };

    this.tellWindowToHideToolbar = function() {
        tellActiveTabTo("hideToggleBar");
    };

    this.registerCommunicationListeners = function(engineName, listeners) {
        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                console.log("Message reached listener: " + request.msg);
                var splittedMsg = request.msg.split("-");

                if (splittedMsg[0] != engineName) {
                    return;
                }

                var msg = splittedMsg[1];

                if (msg in listeners) {
                    listeners[msg](request, sender, sendResponse);
                    console.log("executed");
                }                
            });
    };

    this.tellWindowToRefreshToggleBar = function (toggles) {
        tellActiveTabTo({ msg: "refreshToggleBar", toggles: toggles });
    };

    var tellActiveTabTo = function (message, callback) {
        var request = typeof message === 'string'
            ? { msg: message }
            : message;

        request.msg = "window-" + request.msg;

        console.log(request);

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, request, function (response) {
                if (callback) {
                    callback(response);
                }
            });
        });
    };

    var tellChromeTo = function(message, callback) {
        var request = typeof message === 'string'
            ? { msg: message }
            : message;

        request.msg = "chrome-" + request.msg;

        console.log(request);

        chrome.runtime.sendMessage(request, function(response) {
            if (callback) {
                callback(response);
            }
        });
    };
};