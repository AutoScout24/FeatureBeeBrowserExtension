FeatureBeeTogglesExtensionStorage = new function () {

    var storedToggles = [];

    var config = {
        isToggleBarEnabled: false,
        isAutoRefreshEnabled: false,
        lastUsedFilter: "",
        environments: []
    };

    this.initCache = function() {
        retrieveTogglePersonalConfig(function (toggles) {
            if (toggles) {
                storedToggles = toggles;
            }            
        });

        retrieveConfiguration(function (configuration) {
            if (configuration) {
                config = configuration;
            }
        });

        retrieveEnvironments(function (foundEnvironments) {
            if (foundEnvironments) {
                config.environments = foundEnvironments;
            }            
        });
    };

    this.getCachedStoredToggles = function() {
        return storedToggles;
    };

    this.getEnvironments = function() {
        return config.environments;
    };

    this.getConfiguration = function() {
        return config;
    };

    this.updateConfiguration = function (configuration) {
        config = configuration;
        persistConfiguration();
    };

    this.updateEnvironments = function (environments) {
        config.environments = environments;
        persistConfiguration();
    };

    this.setToogleBarOn = function() {
        config.isToggleBarEnabled = true;
        persistConfiguration();
    };

    this.setToogleBarOff = function() {
        config.isToggleBarEnabled = false;
        persistConfiguration();
    };

    this.setAutoRefreshLastStatusOn = function () {
        config.isAutoRefreshEnabled = true;
        persistConfiguration();
    };

    this.setAutoRefreshLastStatusOff = function () {
        config.isAutoRefreshEnabled = false;
        persistConfiguration();
    };
    
    this.setFilter = function (filter) {
        config.lastUsedFilter = filter;
        persistConfiguration();
    };

    this.updateToggle = function (toggle) {
        console.log("Updating toggle");
        console.log(toggle);
        for (var i in storedToggles) {
            if (storedToggles[i] == toggle.id) {
                storedToggles = storedToggles.splice(i, 1);
                break;
            }
        };

        storedToggles.push(toggle);
        chrome.storage.local.set({ "togglePersonalConfig": storedToggles });
    };

    var retrieveEnvironments = function(callback) {
        chrome.storage.local.get(null, function (value) {
            console.log("retrieving enviroments");
            console.log(value);
            var environments = value.configuration.environments || [];

            if (environments.length == 0) {
                environments = [
                    { name: "Autoscout24", pattern: "(autoscout24\.)" },
                    { name: "AS24", pattern: "(as24\.)" },
                    { name: "local", pattern: "(\.local)($|n*\/)" }
                ];
            }

            callback(environments);
        });
    };

    var retrieveTogglePersonalConfig = function (callback) {        
        chrome.storage.local.get(null, function (value) {
            console.log(":");
            console.log(value);
            callback(value.togglePersonalConfig);
        });        
    };

    var retrieveConfiguration = function(callback) {
        chrome.storage.local.get(null, function(value) {
            console.log("configuration:");
            console.log(value);
            callback(value.configuration);
        });
    };

    var persistConfiguration = function () {
        console.log("persist config");
        console.log(config);
        chrome.storage.local.set({ "configuration": config });
    };
};