FeatureBeeToggleActiveEnviroments = {
    allEnviroments: [
        { name: "Autoscout24", pattern: new RegExp("(autoscout24.)") },
        { name: "AS24", pattern: new RegExp("(as24.)") },
        { name: "local", pattern: new RegExp("(.local)($|n*\/)") }
    ],

    isToggleActiveEnvironment: function (url) {
        for (var i in this.allEnviroments) {
            if (new RegExp(this.allEnviroments[i].pattern).test(url)) {
                return true;
            }
        }

        return false;
    }
};

function refreshEnviroments() {
    chrome.storage.local.get(null, function (value) {
        if (value.environments && value.environments != "") {
            FeatureBeeToggleActiveEnviroments.allEnviroments = [];
            for (var i = 0; i < value.environments.length; i++) {
                FeatureBeeToggleActiveEnviroments.allEnviroments.push(value.environments[i]);
            }
        } else {
            FeatureBeeToggleActiveEnviroments.allEnviroments = [
                { name: "Autoscout24", pattern: "(autoscout24\.)" },
                { name: "AS24", pattern: "(as24\.)" },
                { name: "local", pattern: "(\.local)($|n*\/)" }
            ];
        };
    });
};

refreshEnviroments();

chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
          var msg = request.msg;
          console.log("msg is there: " + msg);

          switch (msg) {
              case "isThisUrlEligibleForFeatureBee?":
                  console.log("Responding to isThisUrlEligibleForFeatureBee? about " + request.url);
                  sendResponse({ answer: FeatureBeeToggleActiveEnviroments.isToggleActiveEnvironment(request.url) ? "yes" : "no"});
                  break;
              case "updateCurrentEnvironments":
                  console.log("Updating environments");
                  console.log(FeatureBeeToggleActiveEnviroments.allEnviroment);
                  chrome.storage.local.set({ environments: request.updatedEnvironments }, function() {
                      refreshEnviroments();
                  });                  
                  break;
              default:
          }
      });

console.log(FeatureBeeToggleActiveEnviroments.allEnviroments);