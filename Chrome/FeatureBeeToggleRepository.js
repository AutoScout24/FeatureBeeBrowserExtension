FeatureBeeToggleRepository = new function () {
    
    this.currentToggles = null;

    this.getOverridenTogglesFromStorage = function() {
        return localStorage["featureBeeTogglesOverrides"] ? JSON.parse(localStorage["featureBeeTogglesOverrides"]) : [];
    };

    this.getFeatureBeeServerToggles = function() {
        var parser = document.createElement('a');
        parser.href = document.URL;
        var featurebeeFeaturesPath = parser.host + '/featurebee.axd/features';

        var request = new XMLHttpRequest();
        request.open('GET', featurebeeFeaturesPath, false);
        request.send(null);

        var toggles = [];

        if (request.status === 200) {
            toggles = eval(request.responseText);
        }

        for (var i = 0; i < toggles.length; i++) {
            toggles[i].id = toggles[i].Name;
        }

        console.log("contacted featurebee server:");
        console.log(toggles);
        return toggles;
    };

    this.refreshCurrentToggles = function () {

        var parser = document.createElement('a');
        parser.href = document.URL;
        var featurebeeFeaturesPath = parser.host + '/featurebee.axd/features';

        var request = new XMLHttpRequest();
        request.open('GET', featurebeeFeaturesPath, false);
        request.send(null);

        var currentToggles = [];

        if (request.status === 200) {
            currentToggles = eval(request.responseText);
        }

        for (var p in currentToggles) {
            currentToggles[p].id = currentToggles[p].Name;
        }

        var overwrittenToggles = this.getOverridenTogglesFromStorage();

        for (var i in overwrittenToggles) {
            var toggle = overwrittenToggles[i];
            for (var t in currentToggles) {
                var currentToggle = currentToggles[t];
                if (currentToggle.id == toggle.id) {
                    if (currentToggle.State != toggle.State) {
                        FeatureBeeTogglesExtensionStorage.persistTogglePersonalConfig(toggle);
                    } else {
                        currentToggles[t] = toggle;
                    }

                    continue;
                }
            }
        }

        this.currentToggles = currentToggles;
    };

    this.retrieveCurrentActiveToggles = function(toggles) {
        var activeToggles = [];

        for (var a in toggles) {
            if (toggles[a].Enabled) {
                activeToggles.push(toggles[a]);
            }
        }

        return activeToggles;

    };

    this.updateCookieForActiveToggles = function (toggles) {
        var activeToggles = this.retrieveCurrentActiveToggles(toggles);
        var d = new Date();
        d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
        var value = "";

        for (var a in activeToggles) {
            value += (value.length === 0 ? "" : "#") + activeToggles[a].Name;
        }

        var expires = "expires=" + d.toGMTString();
        document.cookie = "featurebee=" + encodeURIComponent(value) + "; " + expires + ";domain=" + parseDomain(document.URL) + ";path=/";
    };

    this.updateToggleStatus = function (toggle) {
        toggle.wasOverwritten = true;

        var toggleOverrides = this.getOverridenTogglesFromStorage();
        var toggleWasAlreadyOverridden = false;

        for (var t in toggleOverrides) {
            if (toggleOverrides[t].id == toggle.id) {
                toggleOverrides[t] = toggle;
                toggleWasAlreadyOverridden = true;
                break;
            }
        }

        if (!toggleWasAlreadyOverridden) {
            toggleOverrides.push(toggle);
        }

        localStorage["featureBeeTogglesOverrides"] = JSON.stringify(toggleOverrides);

        for (var t in this.currentToggles) {
            if (this.currentToggles[t].id == toggle.id) {
                this.currentToggles[t] = toggle;
                break;
            }
        }
    };

    function parseDomain(url) {
        var parser = document.createElement('a');
        parser.href = url;
        var domainArray = parser.host.split(".").reverse();
        return "." + domainArray[1] + "." + domainArray[0];
    }
};