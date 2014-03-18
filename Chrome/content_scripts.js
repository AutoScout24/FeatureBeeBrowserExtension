(function () {
    if (FeatureBeeToggleActiveEnviroments.isToggleActiveEnvironment(document.URL)) {

        FeatureBeeToggleRepository.updateCookieForActiveToggles();
        FeatureBeeTogglesExtensionStorage.getToggleBarStatus(function (value) {
            if (value) {
                FeatureBeeToggleBar.show();
            };
        });

        window.addEventListener("unload", function (e) {
            FeatureBeeToggleRepository.updateCookieForActiveToggles();
        }, false);
    }
}());
