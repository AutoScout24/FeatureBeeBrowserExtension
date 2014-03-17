FeatureBeeToggleRepository = new function () {

    this.retrieveCurrentToggles = function (callback) {
      
        FeatureBeeTogglesExtensionStorage.retrieveTogglePersonalConfig(function(overwrittenToggles) {

            var currentToggles;

            currentToggles = [
            {
                id: 1,
                name: "Hi, I'm a toggle",
                isActive: true,
                status: "In Development",
                team: "Dealer"
            },
            {
                id: 2,
                name: "Hi! I'm a off toggle",
                isActive: false,
                status: "In Development",
                team: "Dealer"
            },
            {
                id: 3,
                name: "I'm a toggle and I feel goooood",
                isActive: true,
                status: "Released",
                team: "ASM Endkunde"
            },
            {
                id: 4,
                name: "I'm a toggle on vacation. That's why I'm set to off. In addition, i have a very very long name.",
                isActive: false,
                status: "Under Test",
                team: "ASM Endkunde"
            }
            ];

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
        });        
    };

    //this.getToggleById = function (id, callback) {
    //    var currentToggles = this.retrieveCurrentToggles(function() {
    //        for (var i in currentToggles) {
    //            var toggle = currentToggles[i];
    //            if (toggle.id == id) {
    //                callback(toggle);
    //            }
    //        }
    //    });
    //};

    this.updateToggleStatus = function (toggle, isActive) {      
        toggle.isActive = isActive;
        toggle.wasOverwritten = true;

        FeatureBeeTogglesExtensionStorage.persistTogglePersonalConfig(toggle);
    };
};