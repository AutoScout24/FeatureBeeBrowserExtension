(function () {
    if (FeatureBeeToggleActiveEnviroments.isToggleActiveEnvironment(document.URL))
    {
        FeatureBeeTogglesExtensionStorage.getToggleBarStatus(function (value) {
            if (value) {
                FeatureBeeToggleBar.show();
            };
        });
    }
}());
