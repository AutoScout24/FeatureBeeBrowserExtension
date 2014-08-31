(function () {

    FeatureBeeCommunicationEngine.askChromeIfUrlIsEnabledForFeatureBee(document.URL, function (response) {
        console.log("they said " + response.answer + " to url " + document.URL);

        if (response.answer == "yes") {

            FeatureBeeCommunicationEngine.tellChromeToReviseAndCacheToggles(FeatureBeeClient.getFeatureBeeServerToggles(), function (togglesResponse) {
                FeatureBeeCommunicationEngine.tellChromeToGiveMeTheCurrentConfiguration(function(configResponse) {
                    if (configResponse.config.isToggleBarEnabled) {
                        FeatureBeeToggleBar.show(togglesResponse.toggles);
                    }
                });
                FeatureBeeClient.updateCookieForOverriddeToggles(togglesResponse.toggles);
            });
        }
    });        
}());
