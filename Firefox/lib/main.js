var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var self = require("sdk/self");

var button = buttons.ActionButton({
    id: "FeatureBeeExtension",
    label: "Feature Bee Extension",
    icon: {
        "16": "./bee_16.png",
        "32": "./bee_48.png",
        "64": "./bee_128.png"
    },
    onClick: handleClick
});

function handleClick(state) {
    tabs.activeTab.attach({
        contentScriptFile: [self.data.url("styles.css"), self.data.url("Repository.js"), self.data.url("Presenter.js")]
    });

    tabs.activeTab.attach({
        contentScript: 'document.body.innerHTML += \'<link rel="stylesheet" type="text/css" origin="featureBeeExtension" href="' + self.data.url("styles.css") + '">\';'
    });
}