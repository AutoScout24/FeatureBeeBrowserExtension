FeatureBeeCentral = new function () {

    var cachedToggles = [];

    FeatureBeeTogglesExtensionStorage.initCache();
    
    chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
          var msg = request.msg;
          console.log("FeatureBeeCentral: msg is there: " + msg);

          switch (msg) {
              case "chrome-reviseAndCacheToggles":                  
                  sendResponse({ toggles: FeatureBeeCentral.reviseAndCacheToggles(request.toggles) });
                  break;
              case "chrome-tellMeMyConfiguration":
                  sendResponse({ config: FeatureBeeTogglesExtensionStorage.getConfiguration() });
                  break;
              case "chrome-saveMyConfiguration":
                  FeatureBeeTogglesExtensionStorage.updateConfiguration(request.config);
                  break;
              case "chrome-giveMeAllCachedToggles":
                  sendResponse({ toggles: cachedToggles });
                  break;
              case "chrome-updateThisToggle":
                  var toggle = request.toggle;
                  FeatureBeeTogglesExtensionStorage.updateToggle(toggle);
                  for (var i = 0; i < cachedToggles.length; i++) {
                      if (cachedToggles[i].id == toggle.id) {
                          cachedToggles[i] = toggle;
                          break;
                      }
                  }

                  var config = FeatureBeeTogglesExtensionStorage.getConfiguration();

                  if (config.isAutoRefreshEnabled) {
                      FeatureBeeCommunicationEngine.tellWindowToRefresh();
                      break;
                  }

                  if (config.isToggleBarEnabled) {
                      FeatureBeeCommunicationEngine.tellWindowToRefreshToggleBar(cachedToggles);
                  }

                  break;
              default:
          }
      });

    this.reviseAndCacheToggles = function (toggles) {
        console.log("Revising and cahicng toggles");
        console.log(toggles);

        var storedToggles = FeatureBeeTogglesExtensionStorage.getCachedStoredToggles();
        for (var i in storedToggles) {

            var storedToggle = storedToggles[i];
            for (var t in toggles) {

                var currentToggle = toggles[t];
                if (currentToggle.id == storedToggle.id) {

                    if (currentToggle.State == storedToggle.State) {
                        toggles[t] = storedToggle;
                        continue;
                    }
                }
            }
        }

        console.log("caching toggles");
        console.log(toggles);
        cachedToggles = toggles;

        return toggles;
    };
}