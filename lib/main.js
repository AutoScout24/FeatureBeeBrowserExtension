var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var self = require("sdk/self");

var button = buttons.ActionButton({
    id: "FeatureBeeExtension",
    label: "Feature Bee Extension",
    icon: {
        "16": "./img/bee_16.png",
        "32": "./img/bee_48.png",
        "64": "./img/bee_128.png"
    },
    onClick: handleClick
});

function handleClick(state) {

    tabs.activeTab.attach({
        contentScript: 'var body = document.getElementsByTagName("body")[0];' +
                       'var s0 = document.createElement("script");s0.src = "' + self.data.url("js/firefox/FeatureBeeClientInterface.js") + '";s0.async = false;body.appendChild(s0);' +
                       'var s1 = document.createElement("script");s1.src = "' + self.data.url("js/Repository.js") + '";s1.async = false;body.appendChild(s1);' +
                       'var s2 = document.createElement("script");s2.src = "' + self.data.url("js/Presenter.js") + '";s2.async = false;body.appendChild(s2);'
    });
}