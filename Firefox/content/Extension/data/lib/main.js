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
        contentScript: 'var body = document.getElementsByTagName("body")[0];var s1 = document.createElement("script");s1.src = "' + self.data.url("Repository.js") + '";s1.async = false;body.appendChild(s1);' +
                       'var s2 = document.createElement("script");s2.src = "' + self.data.url("Presenter.js") + '";s2.async = false;body.appendChild(s2);'
                       
    });

    //tabs.activeTab.attach({
    //    contentScript: 'document.body.innerHTML += \'<link rel="stylesheet" type="text/css" origin="featureBeeExtension" href="' + self.data.url("styles.css") + '">\';'
    //});
}