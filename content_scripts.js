(function () {
    var possibleUrls = [
        new RegExp("(autoscout24.)"),
        new RegExp("(as24.)"),
        new RegExp("(.local)($|n*\/)")
    ];

    for (var i in possibleUrls) {
        if (possibleUrls[i].test(document.URL)) {
            FeatureBeeTogglesExtensionStorage.getToggleBarStatus(function (value) {
                if (value) {        
                    FeatureBeeToggleBar.show();
                };
            });
        }
    }
}());
