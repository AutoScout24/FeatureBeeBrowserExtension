FeatureBeeTogglesExtensionStorage = new function(){
    
    this.getToggleBarStatus = function (callback) {        
        chrome.storage.local.get(null, function (value) {
            callback(value.toggleBarOnOffValueName);
        });
    };

    this.setToogleBarOn = function() {
        chrome.storage.local.set({ "toggleBarOnOffValueName": true });
    };

    this.setToogleBarOff = function() {
        chrome.storage.local.set({ "toggleBarOnOffValueName": false });
    };

    this.getAutoRefreshLastStatus = function (callback) {
        chrome.storage.local.get(null, function (value) {
            callback(value.autoRefreshLastStatus);
        });
    };

    this.setAutoRefreshLastStatusOn = function () {
        chrome.storage.local.set({ "autoRefreshLastStatus": true });
    };

    this.setAutoRefreshLastStatusOff = function () {
        chrome.storage.local.set({ "autoRefreshLastStatus": false });
    };

    this.persistTogglePersonalConfig = function (toggle) {
        console.log("Persisting toggle: " + toggle.Name);
        this.retrieveTogglePersonalConfig(function (value) {
            var fullToggleConfig = value || [];

            for (var i in fullToggleConfig) {
                if (fullToggleConfig[i] == toggle.id) {
                    fullToggleConfig = fullToggleConfig.splice(i, 1);
                    break;
                }
            };

            fullToggleConfig.push(toggle);

            chrome.storage.local.set({ "togglePersonalConfig": fullToggleConfig });
            console.log("Storage after persist:");
            console.log(chrome.storage.local);
        });        
    };

    this.retrieveTogglePersonalConfig = function (callback) {        
        chrome.storage.local.get(null, function (value) {
            console.log(":");
            console.log(value);
            callback(value.togglePersonalConfig);
        });        
    };

    this.retrieveLastUsedFilter = function (callback) {
        chrome.storage.local.get(null, function (value) {
            callback(value.lastUsedFilter);
        });
    };

    this.persistFilter = function (filter) {
        chrome.storage.local.set({ "lastUsedFilter": filter });
    };
};