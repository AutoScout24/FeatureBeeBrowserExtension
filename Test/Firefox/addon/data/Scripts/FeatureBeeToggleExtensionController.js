FeatureBeeToggleExtensionController = new function () {

    var currentToggles = null;

    var addToListListObj = document.querySelector('#addExistingTogglesToList'); 
    var showToggleBarCheckbox = document.getElementById("showToggleBar");
    var autoRefreshLastStatusCheckbox = document.getElementById("autoRefresh");
    var filterObj = document.getElementById("filterSelect");
    var backToMyTogglesListObj = document.getElementById("backToMyTogglesList");

    this.popup = function () {
        FeatureBeeCommunicationEngine.tellChromeToGiveMeTheCachedToggles(function (response) {

            if (!response.toggles) {
                displayWarningView("It was not possible to load the toggles for current browser tab. Please refresh current tab and try again.");
                return;
            }

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

        if (toggle.isLocal) {
            addToggleDiv(
                $("#content_my_toggles"),
                createForgetDiv(toggle),
                createSwitchDiv(toggle),
                createToggleNameDiv(toggle.Name),
                createToggleStatusDiv(toggle.State)
            );
        } else {
            addToggleDiv(
               $("#content_add_toggles"),
               createAddDiv(toggle),
               createToggleNameDiv(toggle.Name),
               createToggleStatusDiv(toggle.State)
           );
        }
    };

    function addToggleDiv(contentDiv, div1, div2, div3, div4) {
        var toggleDiv = createDiv("toggle");
        if(div1) toggleDiv.appendChild(div1);
        if(div2) toggleDiv.appendChild(div2);
        if(div3) toggleDiv.appendChild(div3);
        if(div4) toggleDiv.appendChild(div4);

        contentDiv.appendChild(toggleDiv);
    }

    function createForgetDiv(toggle) {
        var div = createDiv("toggle_item toggle_button forget_button");
        div.addEventListener('click', function() {
            FeatureBeeCommunicationEngine.tellChromeToForgetThisToggle(toggle);
            FeatureBeeCommunicationEngine.tellChromeToGiveMeTheCachedToggles(function(response) {
                buildTogglesList(response.toggles);
            });
        });

        return div;
    }

    function createAddDiv(toggle) {
        var div = createDiv("toggle_item toggle_button add_button");

        div.addEventListener('click', function () {
            FeatureBeeCommunicationEngine.tellChromeToUpdateThisToggle(toggle);
            FeatureBeeCommunicationEngine.tellChromeToGiveMeTheCachedToggles(function (response) {
                buildTogglesList(response.toggles);
                displayMyTogglesView();
            });
        });
        return div;
    }

    function getCurrentSelectedFilter() {
        return filterObj.options[filterObj.selectedIndex].value;
    }

    function buildTogglesList(toggles) {
        console.log("buildTogglesList");
        console.log(toggles);

        clearTogglesList();
        
        for (var i in toggles) {
            addToggleToList(toggles[i]);
        }
    }

    function clearTogglesList() {
        $each(".content[data-content='togglesList']", function(div) {
            while (div.firstChild) {
                div.removeChild(div.firstChild);
            }
        });
    }

    function createDiv(classes) {
        var div = document.createElement('div');
        div.className = classes;
        return div;
    };

    function createToggleNameDiv(name) {
        var div = createDiv("toggle_item");
        div.innerText = name;
        return div;
    }

    function createToggleStatusDiv(status) {
        var statusDiv = createDiv("toggle_item toggle_status");
        statusDiv.innerText = "(" + status + ")";

        return statusDiv;
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

        var divSwitchContainer = createDiv("toggle_item");
        divSwitchContainer.appendChild(div);

        return divSwitchContainer;
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

    function setSectionTitle(title) {
        $("#sectionTitle").innerText = title;
    }

    function displayAddTogglesView() {
        $showContent("#content_add_toggles");
        $deactivate("#addExistingTogglesToList");
        $activate("#backToMyTogglesList");
        setSectionTitle("Available Toggles");
    }

    function displayMyTogglesView() {
        $showContent("#content_my_toggles");
        $activate("#addExistingTogglesToList");
        $deactivate("#backToMyTogglesList");
        setSectionTitle("My Toggles");
    }

    function displayWarningView(message) {
        setSectionTitle("Oooooops!");
        $showContent("#content_warn_stop_message");
        $("#headerActions").style.display = "none";
        $(".subheader").style.display = "none";
        $writeIn('.warning_message', message);
    }

    var init = function () {

        //chrome.tabs.query({ currentWindow: true, active: true }, function (currentTab) {
        //    FeatureBeeCommunicationEngine.askChromeIfUrlIsEnabledForFeatureBee(currentTab[0].url, function (response) {
        //        if (response.answer == "no") {
        //            displayWarningView("The current browser tab is not recognized as a Featurebee enviroment");
        //        }
        //    });
        //});

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

    addToListListObj.addEventListener("click", function () {
        displayAddTogglesView();
    });

    backToMyTogglesListObj.addEventListener("click", function () {
        displayMyTogglesView();
    });

    filterObj.addEventListener("change", this.filterToggles);

    this.popup();
    console.log("Finished loading extension");
}