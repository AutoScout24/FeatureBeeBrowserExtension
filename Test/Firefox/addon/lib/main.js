var data = require("sdk/self").data;

var text_entry = require("sdk/panel").Panel({
    width: 600,
    height: 600,
    contentURL: data.url("popup.html"),
    contentScriptFile: [data.url("Styles/featurebee_extension.css"),
                        data.url("Styles/on_off_button.css"),
                        data.url("Scripts/util.js"),
                        data.url("Scripts/FeatureBeeCommunicationEngine.js"),
                        data.url("FeatureBeeToggleExtensionController.js")
                       ]
});

require("sdk/widget").Widget({
  label: "Text entry",
  id: "text-entry",
  contentURL: "http://www.mozilla.org/favicon.ico",
  panel: text_entry
});
