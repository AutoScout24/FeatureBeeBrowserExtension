CommunicationInterface = new function() {

    this.retrieveToggles = function(callback) {
        this.send("giveMeTheCurrentToggleConfiguration", callback);
    };

    this.updateToggle = function (toggle, reloadCurrentPage) {
        this.send({ msg: "updateThisToggle", toggle: toggle, reloadCurrentPage: reloadCurrentPage });
    };

    this.reloadCurrentPage = function() {
        this.send("doAFullPageReload");
    };

    this.showToggleBar = function() {
        this.send("showToggleBar");
    };

    this.hideToggleBar = function() {
        this.send("hideToggleBar");
    };

    this.send = function (message, callback) {
        var request = typeof message === 'string'
            ? { msg: message }
            : message;

        console.log(request);

        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, request, function (response) {
                if (callback) {
                    callback(response);
                }                
            });
        });
    };
}