FeatureBeeClient = new function () {

    var listeners = {
        showToggleBar: function(request) {
            FeatureBeeToggleBar.show(request.toggles);
        },

        hideToggleBar: function() {
            FeatureBeeToggleBar.hide();
        },

        doAFullPageReload: function (request) {
            FeatureBeeClient.updateCookieForOverriddeToggles(request.toggles);
            setTimeout("location.reload(true);", 1000);
        },

        refreshToggleBar: function(request) {
            FeatureBeeToggleBar.reload(request.toggles);
            FeatureBeeClient.updateCookieForOverriddeToggles(request.toggles);
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
    
    this.parseOverriddenToggles = function(toggles) {
        var overriddenToggles = [];

        for (var a in toggles) {
            if (toggles[a].isLocal) {
                overriddenToggles.push(toggles[a]);
            }
        }

        return overriddenToggles;

    };

    this.updateCookieForOverriddeToggles = function (toggles) {
        var overriddenToggles = this.parseOverriddenToggles(toggles);
        var d = new Date();
        d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
        var value = "";

        console.log("updateCookieForOverriddeToggles on domain " + parseDomain(document.URL));
        console.log(overriddenToggles);

        for (var a in overriddenToggles) {
            value += "#" + overriddenToggles[a].Name + "=" + (overriddenToggles[a].Enabled ? "true" : "false");
            //value += "#" + overriddenToggles[a].Name;
        }

        value += "#";

        var expires = "expires=" + d.toGMTString();
        //document.cookie = "featureBee=" + encodeURIComponent(value) + "; " + expires + ";domain=" + parseDomain(document.URL) + ";path=/";
        document.cookie = "featureBee=" + encodeURIComponent(value) + "; " + expires;
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