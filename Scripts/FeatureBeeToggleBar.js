FeatureBeeToggleBar = new function () {

    var barId = 'featurebeeToggleBarId';    

    this.reload = function(toggles) {
        this.removeBar();
        this.show(toggles);
    };

    this.show = function (toggles) {

        var bar = createBar();
        toggles = FeatureBeeClient.parseOverriddenToggles(toggles);

        console.log("Displaying toggles:");
        console.log(toggles);

        if (toggles.length == 0) {
            addToggle("There are current no toggles overrides active in your browser", bar, "none");
        } else {
            for (var i in toggles) {
                addToggle(toggles[i].Name, bar, toggles[i].Enabled ? "enabled" : "disabled");
            }
        }

        document.body.style.marginTop = bar.style.height;
        document.body.appendChild(bar);
    };

    this.hide = function () {
        this.removeBar();
        document.body.style.marginTop = '0px';
    };

    this.removeBar = function() {
        var activeBar = document.getElementById(barId);
        while (activeBar) {
            activeBar.parentNode.removeChild(activeBar);
            activeBar = document.getElementById(barId);
        }
    };
    
    function createBar() {
        var container = document.createElement('ul');
        container.id = barId;
        container.className = "toggle-bar-container";
        container.style.height = '30px';

        container.appendChild(createHeader());
        return container;
    };

    function addToggle(name, bar, icon) {
        var toggleIcon;
        var markClassName = "";
        
        switch (icon) {
            case "enabled":
                toggleIcon = "&#x2713;";
                markClassName = "toggle-bar-mark toggle-bar-mark-enabled";
                break;
            case "disabled":
                markClassName = "toggle-bar-mark toggle-bar-mark-disabled";
                toggleIcon = "&#x2717;";
                break;
            default:
                markClassName = "toggle-bar-mark toggle-bar-mark-no-icon";
                toggleIcon = "";
        }
       
        var toggleContainer = document.createElement('li');
        toggleContainer.className = "toggle-bar-toggle-container";
        
        var toggleNameSpan = document.createElement('span');
        toggleNameSpan.className = "toggle-bar-toggle-name";
        toggleNameSpan.innerText = name;

        if (toggleIcon == "") {
            toggleNameSpan.className = "toggle-bar-mark-no-icon";
        }

        var toggleTickSpan = document.createElement('span');
        toggleTickSpan.className = markClassName;
        toggleTickSpan.innerHTML = toggleIcon;

        toggleTickSpan.appendChild(toggleNameSpan);
        toggleContainer.appendChild(toggleTickSpan);
        bar.appendChild(toggleContainer);
    }

    function createHeader() {
        var headerContainer = document.createElement('li');
        headerContainer.style.display = 'inline-block';
        headerContainer.style.width = "170px";

        var headerImage = document.createElement('span');
        headerImage.className = "toggle-bar-img-header";

        var headerTitle = document.createElement('span');
        headerTitle.className = "toggle-bar-header_title";
        headerTitle.innerText = "FeatureBee   | ";

        headerImage.appendChild(headerTitle);
        headerContainer.appendChild(headerImage);

        return headerContainer;
    }
};