function FeatureBeeToggleExtensionController(){
    
    var toggleListObj = document.querySelector('#toggles');
    var showToggleBarCheckbox = document.getElementById("showToggleBar");
    var autoRefreshLastStatusCheckbox = document.getElementById("autoRefresh");
    var filterObj = document.getElementById("filterSelect");

    this.refreshToggles = function () {
        FeatureBeeToggleRepository.retrieveCurrentToggles(buildTogglesList);
        console.log("Toggles refreshed");
    };

    this.filterToggles = function () {
        FeatureBeeTogglesExtensionStorage.persistFilter(getCurrentSelectedFilter());
        toggleController.refreshToggles();
    };

    this.updateToggleStatus = function (toggle, isActive) {        
        FeatureBeeToggleRepository.updateToggleStatus(toggle, isActive);

        if (autoRefreshLastStatusCheckbox.checked) {
            chrome.tabs.executeScript({
                code: 'location.reload(true)'
            });
            window.close();
        } else {
            FeatureBeeTogglesExtensionStorage.getToggleBarStatus(function (isBarActive) {
                if (isBarActive) {
                    chrome.tabs.executeScript({
                        file: 'FeatureBeeToggleBar.js'
                    });
                    chrome.tabs.executeScript({
                        code: 'FeatureBeeToggleBar.reload();'
                    });
                }
            });
        }
    };

    function addToggleToList(toggle) {
        var filter = getCurrentSelectedFilter();

        if (filter && filter != "" && filter != toggle.team) {
            return;
        }
        
        var toggleDiv = createDiv("toggle");
        var switchDiv = createSwitchDiv(toggle);
        var toggleNameDiv = createToggleNameDiv(toggle.name);
        var toggleStatus = createToggleStatusDiv(toggle.status);

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
        checkbox.checked = toggle.isActive;
        checkbox.className = "onoffswitch-checkbox";
        checkbox.myToggle = toggle;
        div.style.marginLeft = "4px";

        checkbox.addEventListener('change', function () {
            toggleController.updateToggleStatus(toggle, checkbox.checked);
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

    var handleToggleBarStatus = function() {
        if (showToggleBarCheckbox.checked) {
            chrome.tabs.executeScript({
                file: 'FeatureBeeToggleBar.js'
            });
            chrome.tabs.executeScript({
                code: 'FeatureBeeToggleBar.show();'
            });

            FeatureBeeTogglesExtensionStorage.setToogleBarOn();
        } else {
            chrome.tabs.executeScript({
                code: 'FeatureBeeToggleBar.hide();'
            });
            FeatureBeeTogglesExtensionStorage.setToogleBarOff();
        }
    };

    var handleAutoRefreshLastStatus = function () {
        if (autoRefreshLastStatusCheckbox.checked) {
            FeatureBeeTogglesExtensionStorage.setAutoRefreshLastStatusOn();
        } else {
            FeatureBeeTogglesExtensionStorage.setAutoRefreshLastStatusOff();
        }
    };

    var init = function () {

        chrome.tabs.query({ currentWindow: true, active: true }, function (currentTab) {
            if (!FeatureBeeToggleActiveEnviroments.isToggleActiveEnvironment(currentTab[0].url)) {                
                document.getElementById("noToggleActiveMessage").style.display = "block";
                document.getElementById("togglesContainer").style.display = "none";
            }
        });

        FeatureBeeTogglesExtensionStorage.getToggleBarStatus(function (isActive) {
            showToggleBarCheckbox.checked = isActive;
        });

        FeatureBeeTogglesExtensionStorage.getAutoRefreshLastStatus(function (isActive) {
            autoRefreshLastStatusCheckbox.checked = isActive;
        });

        FeatureBeeTogglesExtensionStorage.retrieveLastUsedFilter(function(filter) {
            for (var o in filterObj.options) {
                if (filterObj.options[o].value == filter) {
                    filterObj.options[o].selected = true;
                }
            }
        });

        showToggleBarCheckbox.addEventListener('click', handleToggleBarStatus, false);
        autoRefreshLastStatusCheckbox.addEventListener('click', handleAutoRefreshLastStatus, false);
    }();

    filterObj.addEventListener("change", this.filterToggles);
}