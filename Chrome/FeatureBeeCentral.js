﻿FeatureBeeCentral = new function () {

    var cachedToggles = [];

    FeatureBeeTogglesExtensionStorage.initCache();

    var listeners = {

        reviseAndCacheToggles: function (request, sender, sendResponse) {
            sendResponse({ toggles: FeatureBeeCentral.reviseAndCacheToggles(request.toggles) });
        },

        tellMeMyConfiguration: function(request, sender, sendResponse) {
            sendResponse({ config: FeatureBeeTogglesExtensionStorage.getConfiguration() });
        },

        saveMyConfiguration: function(request) {
            FeatureBeeTogglesExtensionStorage.updateConfiguration(request.config);
        },

        giveMeAllCachedToggles: function(request, sender, sendResponse) {
            sendResponse({ toggles: cachedToggles });
        },

        updateThisToggle: function(request) {
            FeatureBeeCentral.updateToggle(request.toggle);
        },

        tellMeIfThisUrlIsEligibleForFeatureBee: function (request, sender, sendResponse) {
            sendResponse({ answer: FeatureBeeCentral.isToggleActiveEnvironment(request.url)});
        },

        updateCurrentEnvironments: function (request) {
            FeatureBeeTogglesExtensionStorage.updateEnvironments(request.updatedEnvironments);
        },

        clearConfiguration: function() {
            FeatureBeeTogglesExtensionStorage.resetConfigurationToDefaults();
        }
    };

    FeatureBeeCommunicationEngine.registerCommunicationListeners("chrome", listeners);

    this.reviseAndCacheToggles = function (toggles) {
        console.log("Revising and cahicng toggles");
        console.log(toggles);

        for (var j = 0; j < toggles.length; j++) {
            toggles[j].serverEnabled = toggles[j].Enabled || false;
            toggles[j].overiddesServerEnabled = false;
        }

        var storedToggles = FeatureBeeTogglesExtensionStorage.getCachedStoredToggles();
        for (var i in storedToggles) {

            var storedToggle = storedToggles[i];
            for (var t in toggles) {

                var currentToggle = toggles[t];
                if (currentToggle.id == storedToggle.id) {

                    if (currentToggle.State == storedToggle.State) {

                        var overiddesServerEnabled = currentToggle.serverEnabled != storedToggle.Enabled;
                        toggles[t].overiddesServerEnabled = overiddesServerEnabled;
                        toggles[t].isLocal = true;
                        toggles[t].Enabled = storedToggle.Enabled;
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

    this.updateToggle = function (toggle) {
        var isEnabled = toggle.Enabled;

        for (var i = 0; i < cachedToggles.length; i++) {
            if (cachedToggles[i].id == toggle.id) {
                toggle = cachedToggles[i];
                toggle.overiddesServerEnabled = toggle.serverEnabled != toggle.Enabled;
                toggle.Enabled = isEnabled;
                toggle.isLocal = true;

                FeatureBeeTogglesExtensionStorage.updateToggle(toggle);
                break;
            }
        }

        var config = FeatureBeeTogglesExtensionStorage.getConfiguration();

        if (config.isAutoRefreshEnabled) {
            FeatureBeeCommunicationEngine.tellWindowToRefresh(cachedToggles);
            return;
        }

        if (config.isToggleBarEnabled) {
            FeatureBeeCommunicationEngine.tellWindowToRefreshToggleBar(cachedToggles);
        }
    };

    this.isToggleActiveEnvironment = function(url) {
        var environments = FeatureBeeTogglesExtensionStorage.getEnvironments();
        for (var i in environments) {
            if (new RegExp(environments[i].pattern).test(url)) {
                return "yes";
            }
        }

        return "no";
    };
}