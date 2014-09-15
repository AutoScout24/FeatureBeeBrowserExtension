FeatureBeeClientInterface = {

    getExtensionPath: function (subpath) {
        return chrome.extension.getURL(subpath);
    },

    sendCommand: function (command, value) {
        chrome.runtime.sendMessage({
            action: command,
            value: value
        });
    }
}