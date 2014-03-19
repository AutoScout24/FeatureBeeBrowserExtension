(function () {
    if (FeatureBeeToggleActiveEnviroments.isToggleActiveEnvironment(document.URL)) {

        FeatureBeeToggleRepository.refreshCurrentToggles();
        FeatureBeeToggleRepository.updateCookieForActiveToggles();

        if (localStorage["featureBeeToggleBar"] === "show") {
            FeatureBeeToggleBar.show();
        }

        window.addEventListener("unload", function (e) {
            FeatureBeeToggleRepository.refreshCurrentToggles();
            FeatureBeeToggleRepository.updateCookieForActiveToggles();
        }, false);
    }
    
    chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
          var msg = request.msg;
          console.log("msg is there: " + msg);

          switch (msg) {
              case "giveMeTheCurrentToggleConfiguration":
                  console.log("Responding to giveMeTheCurrentToggleConfiguration");
                  sendResponse({ result: FeatureBeeToggleRepository.currentToggles });
                  break;
              case "updateThisToggle":
                  console.log("Responding to updateThisToggle");
                  console.log(request.toggle);
                  FeatureBeeToggleRepository.updateToggleStatus(request.toggle);
                  FeatureBeeToggleRepository.updateCookieForActiveToggles();
                  sendResponse({ result: true });
                  if (request.reloadCurrentPage) {
                      location.reload(true);
                  } else {
                      FeatureBeeToggleBar.reload();
                  }
                  break;
              case "showToggleBar":
                  console.log("Responding to showToggleBar");
                  localStorage["featureBeeToggleBar"] = "show";
                  FeatureBeeToggleBar.show();
                  break;
              case "hideToggleBar":
                  console.log("Responding to hideToggleBar");
                  localStorage["featureBeeToggleBar"] = "hide";
                  FeatureBeeToggleBar.hide();
                  break;
          default:
          }
      });

    //chrome.runtime.onConnect.addListener(function (port) {
    //    alert("add lostener content");
    //    console.assert(port.name == "featureBeeToggleExtension");
    //    port.onMessage.addListener(function (msg) {
    //        if (msg.action == "getCachedToggles") {
    //            port.postMessage({ action: "updateCachedToggles", cachedToggles: localStorage["featureBeeTogglesCache"] });
    //        }
    //    });
    //});
}());
