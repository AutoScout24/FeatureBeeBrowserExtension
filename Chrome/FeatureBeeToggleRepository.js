FeatureBeeToggleRepository = new function () {

    this.retrieveCurrentToggles = function (callback) {
      
        FeatureBeeTogglesExtensionStorage.retrieveTogglePersonalConfig(function (overwrittenToggles) {
            var retrieveFeaturesBasedOnPathDelegate = function(currentUrl) {

                var parser = document.createElement('a');
                parser.href = currentUrl;
                var featurebeeFeaturesPath = parser.host + '/featurebee.axd/features';
                alert(featurebeeFeaturesPath);

                var request = new XMLHttpRequest();
                request.open('GET', featurebeeFeaturesPath, false); 
                request.send(null);

                var currentToggles = [];

                if (request.status === 200) {
                    currentToggles = eval(request.responseText);
                }

                console.log("Overwritten:");
                console.log(overwrittenToggles);

                for (var i in overwrittenToggles) {
                    var toggle = overwrittenToggles[i];
                    for (var t in currentToggles) {
                        var currentToggle = currentToggles[t];
                        if (currentToggle.id == toggle.id) {
                            if (currentToggle.status != toggle.status) {
                                FeatureBeeTogglesExtensionStorage.persistTogglePersonalConfig(toggle);
                            } else {
                                currentToggles[t] = toggle;
                            }
                        }
                    }
                }

                console.log(currentToggles);
                console.log("now calling: ");
                console.log(callback);
                callback(currentToggles);
            };

            if (chrome.tabs) {
                chrome.tabs.query({ currentWindow: true, active: true }, function (currentTab) {
                    retrieveFeaturesBasedOnPathDelegate(currentTab[0].url);
                });
            } else {
                retrieveFeaturesBasedOnPathDelegate(document.URL);
            }
        });          
    };

    this.retrieveCurrentActiveToggles = function(callback) {
        this.retrieveCurrentToggles(function(allToggles) {
            var activeToggles = [];

            for (var a in allToggles) {
                if (allToggles[a].isActive) {
                    activeToggles.push(allToggles[a]);
                }
            }

            callback(activeToggles);
        });
    };

    this.updateCookieForActiveToggles = function () {
        this.retrieveCurrentActiveToggles(function(toggles) {
            var d = new Date();
            d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
            var value = "";

            for (var a in toggles) {
                value += (value.length === 0 ? "" : "#") + toggles[a].name;
            }

            var expires = "expires=" + d.toGMTString();
            document.cookie = "featurebee=" + encodeURIComponent(value) + "; " + expires;
        });
    };

    this.updateToggleStatus = function (toggle, isActive) {      
        toggle.isActive = isActive;
        toggle.wasOverwritten = true;

        FeatureBeeTogglesExtensionStorage.persistTogglePersonalConfig(toggle);
    };
};