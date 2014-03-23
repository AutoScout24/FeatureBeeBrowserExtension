FeatureBeeToggleExtensionController = new function () {

    var currentToggles = null;

    var toggleListObj = document.querySelector('#toggles');
    var showToggleBarCheckbox = document.getElementById("showToggleBar");
    var autoRefreshLastStatusCheckbox = document.getElementById("autoRefresh");
    var filterObj = document.getElementById("filterSelect");

    this.popup = function () {
        FeatureBeeCommunicationEngine.tellChromeToGiveMeTheCachedToggles(function(response) {
            currentToggles = response.toggles;
            buildTogglesList(response.toggles);
        });
    };

    this.filterToggles = function () {
        FeatureBeeCommunicationEngine.tellChromeToGiveMeTheCurrentConfiguration(function (response) {
            var configuration = response.config;
            configuration.lastUsedFilter = getCurrentSelectedFilter();
            FeatureBeeCommunicationEngine.tellChromeToSaveMeTheCurrentConfiguration(configuration);
            buildTogglesList(currentToggles);
        });        
    };

    this.updateToggleStatus = function (toggle, enabled) {
        toggle.Enabled = enabled;
        FeatureBeeCommunicationEngine.tellChromeToUpdateThisToggle(toggle);

        if (autoRefreshLastStatusCheckbox.checked) {
            window.close();
        }
    };

    function addToggleToList(toggle) {
        var filter = getCurrentSelectedFilter();

        if (filter && filter != "" && filter != toggle.Team) {
            return;
        }

        var toggleDiv = createDiv("toggle");
        var switchDiv = createSwitchDiv(toggle);
        var toggleNameDiv = createToggleNameDiv(toggle.Name);
        var toggleStatus = createToggleStatusDiv(toggle.State);

        toggleDiv.appendChild(toggleStatus);
        toggleDiv.appendChild(switchDiv);
        toggleDiv.appendChild(toggleNameDiv);

        toggleListObj.appendChild(toggleDiv);
    };

    function getCurrentSelectedFilter() {
        return filterObj.options[filterObj.selectedIndex].value;
    }

    function buildTogglesList(toggles) {
        console.log("buildTogglesList");
        console.log(toggles);
        clearTogglesList();

        if (toggles.length === 0) {
            var noToggle = document.createElement('span');
            noToggle.innerText = "No Toggles found";
            noToggle.className = "toggle";
            toggleListObj.appendChild(noToggle);
        }

        for (var i in toggles) {
            addToggleToList(toggles[i]);
        }
    }

    function clearTogglesList() {

        var filterNode = document.getElementById("filter");

        while (toggleListObj.firstChild) {
            toggleListObj.removeChild(toggleListObj.firstChild);
        }

        toggleListObj.appendChild(filterNode);
    }

    function createDiv(classes) {
        var div = document.createElement('div');
        div.className = classes;
        return div;
    };

    function createToggleNameDiv(name) {
        var div = createDiv("container_cell toggle_text");
        div.innerText = name;
        return div;
    }

    function createToggleStatusDiv(status) {
        var className;

        switch (status) {
            case "In Development":
                className = "toggle_status_development";
                break;
            case "Under Test":
                className = "toggle_status_under_test";
                break;
            case "Released":
                className = "toggle_status_released";
                break;
            default:
                className = "";
        }

        var statusContainer = createDiv("container_cell toggle_status_container");
        var statusDiv = createDiv("toggle_status_item " + className);
        statusContainer.appendChild(statusDiv);

        return statusContainer;
    }

    function createSwitchDiv(toggle) {
        var div = createDiv("onoffswitch container_cell");

        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = "onoffswitch";
        checkbox.id = toggle.id;
        checkbox.checked = toggle.Enabled;
        checkbox.className = "onoffswitch-checkbox";
        checkbox.myToggle = toggle;
        div.style.marginLeft = "4px";

        checkbox.addEventListener('change', function () {
            FeatureBeeToggleExtensionController.updateToggleStatus(toggle, checkbox.checked);
        });

        var label = document.createElement('label');
        label.className = "onoffswitch-label";
        label.setAttribute("for", toggle.id);

        var switchInnerDiv = createDiv("onoffswitch-inner");
        var switchDiv = createDiv("onoffswitch-switch");
        switchDiv.style.height = "9px";

        label.appendChild(switchInnerDiv);
        label.appendChild(switchDiv);

        div.appendChild(checkbox);
        div.appendChild(label);

        return div;
    }

    var handleToggleBarStatus = function () {
        FeatureBeeCommunicationEngine.tellChromeToGiveMeTheCurrentConfiguration(function (response) {
            var config = response.config;
            config.isToggleBarEnabled = showToggleBarCheckbox.checked;
            FeatureBeeCommunicationEngine.tellChromeToSaveMeTheCurrentConfiguration(config);
        });

        if (showToggleBarCheckbox.checked) {
            FeatureBeeCommunicationEngine.tellChromeToGiveMeTheCachedToggles(function (response) {
                FeatureBeeCommunicationEngine.tellWindowToShowToolbar(response.toggles);
            });            
        } else {
            FeatureBeeCommunicationEngine.tellWindowToHideToolbar();
        }
    };

    var handleAutoRefreshLastStatus = function () {
        FeatureBeeCommunicationEngine.tellChromeToGiveMeTheCurrentConfiguration(function (response) {
            var config = response.config;
            config.isAutoRefreshEnabled = autoRefreshLastStatusCheckbox.checked;
            FeatureBeeCommunicationEngine.tellChromeToSaveMeTheCurrentConfiguration(config);
        });
    };

    var init = function () {

        chrome.tabs.query({ currentWindow: true, active: true }, function (currentTab) {
            FeatureBeeCommunicationEngine.askChromeIfUrlIsEnabledForFeatureBee(currentTab[0].url, function (response) {
                if (response.answer == "no") {
                    document.getElementById("noToggleActiveMessage").style.display = "block";
                    document.getElementById("togglesContainer").style.display = "none";
                }
            });
        });

        FeatureBeeCommunicationEngine.tellChromeToGiveMeTheCurrentConfiguration(function (response) {
            var configuration = response.config;
            console.log(configuration);
            showToggleBarCheckbox.checked = configuration.isToggleBarEnabled;
            autoRefreshLastStatusCheckbox.checked = configuration.isAutoRefreshEnabled;

            for (var o in filterObj.options) {
                if (filterObj.options[o].value == configuration.lastUsedFilter) {
                    filterObj.options[o].selected = true;
                }
            }
        });

        showToggleBarCheckbox.addEventListener('click', handleToggleBarStatus, false);
        autoRefreshLastStatusCheckbox.addEventListener('click', handleAutoRefreshLastStatus, false);
    }();

    filterObj.addEventListener("change", this.filterToggles);
    this.popup();
    console.log("Finished loading extension");
}