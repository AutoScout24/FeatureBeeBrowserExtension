FeatureBeeToggleActiveEnviroments = {
    allEnviroments: [
        { name: "Autoscout24", pattern: new RegExp("(autoscout24.)") },
        { name: "AS24", pattern: new RegExp("(as24.)") },
        { name: "local", pattern: new RegExp("(.local)($|n*\/)") }
    ],

    isToggleActiveEnvironment: function (url) {
        for (var i in this.allEnviroments) {
            if (this.allEnviroments[i].pattern.test(url)) {
                return true;
            }
        }

        return false;
    }
};

chrome.storage.local.get(null, function (value) {
    if (value.environments || value.environments == "") {
        FeatureBeeToggleActiveEnviroments.allEnviroments = value.environments;
    } else {
        FeatureBeeToggleActiveEnviroments.allEnviroments = [
            { name: "Autoscout24", pattern: new RegExp("(autoscout24\.)") },
            { name: "AS24", pattern: new RegExp("(as24\.)") },
            { name: "local", pattern: new RegExp("(\.local)($|n*\/)") }
        ];
    };
});

chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
          var msg = request.msg;
          console.log("msg is there: " + msg);

          switch (msg) {
              case "isThisUrlEligibleForFeatureBee?":
                  console.log("Responding to isThisUrlEligibleForFeatureBee? about " + request.url);
                  sendResponse({ answer: FeatureBeeToggleActiveEnviroments.isToggleActiveEnvironment(request.url) ? "yes" : "no"});
                  break;              
              default:
          }
      });

console.log(FeatureBeeToggleActiveEnviroments.allEnviroments);