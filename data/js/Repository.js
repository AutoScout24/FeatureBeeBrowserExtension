var FeatureBeeToggleRepository = function () {

    var availableToggles = null;

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
        }
        return "";
    }

    function setCookie(cname, cvalue) {
        var d = new Date();
        var exdays = 30;
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        var domainSplit = window.location.hostname.split('.');
        var domain = domainSplit.length > 0
                        ? window.location.hostname.replace(domainSplit[0] + ".", ";domain=")
                        : '';
        
        document.cookie = cname + "=" + cvalue + "; " +expires + ";path=/" + domain;
    }

    function retrieveFeatureBeeTogglesFromServer(callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/featurebee.axd/features", true);
        xhr.onload = function () {
            if (xhr.readyState === 4) {
                switch (xhr.status) {
                    case 200:
                        availableToggles = JSON.parse(xhr.responseText);
                        break;
                    case 404:
                        availableToggles = [];
                        break;
                    default:
                        availableToggles = [];
                }

                if (callback) {
                    callback();
                }
            }
        };
        xhr.onerror = function () {
            availableToggles = [];
        };
        xhr.send(null);
    }

    this.init = function(callbackAfterInit) {
        retrieveFeatureBeeTogglesFromServer(callbackAfterInit);
    };

    this.readSavedToggles = function() {
        var savedToggles = getCookie("featureBee");
        savedToggles = unescape(savedToggles);
        savedToggles = savedToggles.split('#');
        var parsedToggles = [];

        for (var i = 0; i < savedToggles.length; i++) {
            var parsedToggle = savedToggles[i].split("=");

            if (parsedToggle.length != 2) {
                continue;
            }

            parsedToggles.push({
                name: parsedToggle[0],
                enabled: parsedToggle[1]
            });
        }

        return parsedToggles;
    };

    this.retrieveMyToggles = function() {
        var savedToggles = this.readSavedToggles();
        var mytoggles = [];

        for (var i = 0; i < savedToggles.length; i++) {
            var toggle = savedToggles[i];

            for (var t = 0; t < availableToggles.length; t++) {
                var availableToggle = availableToggles[t];
                if (availableToggle.Name == toggle.name) {
                    availableToggle.Enabled = toggle.enabled;
                    mytoggles.push(availableToggle);
                    continue;
                }
            }
        }
        return mytoggles;
    };

    this.retrieveOtherAvailableToggles = function() {
        var savedToggles = this.readSavedToggles();
        var othertoggles = [];

        for (var i = 0; i < availableToggles.length; i++) {
            var toggle = availableToggles[i];
            var included = false;

            for (var t = 0; t < savedToggles.length; t++) {
                var savedToggle = savedToggles[t];
                if (savedToggle.name == toggle.Name) {
                    included = true;
                    continue;
                }
            }

            if (!included) {
                othertoggles.push(toggle);
            }
        }

        return othertoggles;
    };

    this.save = function(toggles) {
        var stringfiedToggle = "";

        for (var i = 0; i < toggles.length; i++) {
            var toggle = toggles[i];
            stringfiedToggle += "#" + toggle.name + "=" + toggle.enabled;
        }

        stringfiedToggle = escape(stringfiedToggle + "#");

        setCookie('featureBee', stringfiedToggle);
    };

    this.forgetToggle = function(toggle) {
        var savedToggles = this.readSavedToggles();

        for (var i = 0; i < savedToggles.length; i++) {
            var savedToggle = savedToggles[i];

            if (savedToggle.name == toggle.Name) {
                savedToggles.splice(i, 1);
                break;
            }
        }

        this.save(savedToggles);
    };

    this.addToggle = function(toggle) {
        var savedToggles = this.readSavedToggles();
        savedToggles.push({
            name: toggle.Name,
            enabled: toggle.Enabled
        });
        this.save(savedToggles);
    };

    this.toggleToggleOnOff = function(toggle) {
        var savedToggles = this.readSavedToggles();
        for (var i = 0; i < savedToggles.length; i++) {
            var savedToggle = savedToggles[i];

            if (savedToggle.name == toggle.Name) {
                savedToggle.enabled = savedToggle.enabled == "true" ? "false" : "true";
                savedToggles[i] = savedToggle;
                break;
            }
        }

        this.save(savedToggles);
    };

    this.getFeatureBeeCookieValue = function () {
        return getCookie("featureBee");
    }
};