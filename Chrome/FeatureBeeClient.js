FeatureBeeClient = new function () {

    var listeners = {
        showToggleBar: function(request) {
            FeatureBeeToggleBar.show(request.toggles);
        },

        hideToggleBar: function() {
            FeatureBeeToggleBar.hide();
        },

        doAFullPageReload: function() {
            location.reload(true);
        },

        refreshToggleBar: function(request) {
            FeatureBeeToggleBar.reload(request.toggles);
        }
    };

    FeatureBeeCommunicationEngine.registerCommunicationListeners("window", listeners);

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
    
    this.parseActiveToggles = function(toggles) {
        var activeToggles = [];

        for (var a in toggles) {
            if (toggles[a].Enabled) {
                activeToggles.push(toggles[a]);
            }
        }

        return activeToggles;

    };

    this.updateCookieForActiveToggles = function (toggles) {
        var activeToggles = this.parseActiveToggles(toggles);
        var d = new Date();
        d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
        var value = "";

        for (var a in activeToggles) {
            value += (value.length === 0 ? "" : "#") + activeToggles[a].Name;
        }

        var expires = "expires=" + d.toGMTString();
        document.cookie = "featurebee=" + encodeURIComponent(value) + "; " + expires + ";domain=" + parseDomain(document.URL) + ";path=/";
    };    

    function parseDomain(url) {
        var parser = document.createElement('a');
        parser.href = url;
        var domainArray = parser.host.split(".").reverse();
        return domainArray[1] == "com"
                ? "." + domainArray[2] + "." + domainArray[1] + "." + domainArray[0]
                : "." + domainArray[1] + "." + domainArray[0];
    }
};